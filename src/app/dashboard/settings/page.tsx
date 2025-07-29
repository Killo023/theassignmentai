"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  Palette, 
  Globe,
  Download,
  Trash2,
  Save,
  Edit,
  Camera,
  Key,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Paywall from "@/components/Paywall";
import PaymentService from "@/lib/payment-service";
import { useAuth } from "@/lib/auth-context";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  university?: string;
  major?: string;
  bio?: string;
}

interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    assignments: boolean;
    updates: boolean;
  };
  exportFormat: "pdf" | "docx" | "txt";
  autoSave: boolean;
}

const mockProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@university.edu",
  university: "University of Technology",
  major: "Computer Science",
  bio: "Graduate student passionate about AI and machine learning. Currently working on research projects in natural language processing."
};

const mockPreferences: UserPreferences = {
  theme: "system",
  language: "en",
  notifications: {
    email: true,
    push: true,
    assignments: true,
    updates: false
  },
  exportFormat: "pdf",
  autoSave: true
};

const SettingsPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [preferences, setPreferences] = useState<UserPreferences>(mockPreferences);
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "export", label: "Export Settings", icon: Download }
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const handleNotificationToggle = (key: keyof UserPreferences["notifications"]) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleUpgrade = async (paymentData: any) => {
    if (!user) return false;
    
    try {
      const paymentService = PaymentService.getInstance();
      const result = await paymentService.convertTrialToPaid(user.id, paymentData);
      
      if (result.success) {
        setShowPaywall(false);
        // Refresh subscription status
        const status = await paymentService.checkSubscriptionStatus(user.id);
        setSubscriptionStatus(status);
        return true;
      } else {
        alert('Payment failed: ' + result.message);
        return false;
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Upgrade failed. Please try again.');
      return false;
    }
  };

  // Check subscription status on component mount
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;
      
      try {
        const paymentService = PaymentService.getInstance();
        const status = await paymentService.checkSubscriptionStatus(user.id);
        setSubscriptionStatus(status);
      } catch (error) {
        console.error('Failed to check subscription status:', error);
      }
    };
    
    checkSubscription();
    
    // Listen for subscription changes
    if (user) {
      const paymentService = PaymentService.getInstance();
      paymentService.addSubscriptionChangeListener(checkSubscription);
      
      // Cleanup listener on unmount
      return () => {
        paymentService.removeSubscriptionChangeListener(checkSubscription);
      };
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border rounded-lg p-6"
          >
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-foreground">Profile</h2>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full" />
                      ) : (
                        <User className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    {isEditing && (
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="university">University</Label>
                        <Input
                          id="university"
                          value={profile.university || ""}
                          onChange={(e) => setProfile(prev => ({ ...prev, university: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="major">Major</Label>
                        <Input
                          id="major"
                          value={profile.major || ""}
                          onChange={(e) => setProfile(prev => ({ ...prev, major: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio || ""}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3">
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Save className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Preferences</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Theme</Label>
                    <div className="flex gap-2 mt-2">
                      {[
                        { value: "light", label: "Light", icon: Sun },
                        { value: "dark", label: "Dark", icon: Moon },
                        { value: "system", label: "System", icon: Monitor }
                      ].map((theme) => (
                        <Button
                          key={theme.value}
                          variant={preferences.theme === theme.value ? "default" : "outline"}
                          onClick={() => handleThemeChange(theme.value as "light" | "dark" | "system")}
                          className="flex items-center gap-2"
                        >
                          <theme.icon className="w-4 h-4" />
                          {theme.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Language</Label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                      className="mt-2 px-3 py-2 border border-input rounded-md w-full"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Auto-save</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="autoSave"
                        checked={preferences.autoSave}
                        onChange={(e) => setPreferences(prev => ({ ...prev, autoSave: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="autoSave" className="text-sm">
                        Automatically save assignments as you work
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === "subscription" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Subscription</h2>
                
                {subscriptionStatus?.status === 'active' ? (
                  // Active subscription (Pro user)
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Pro Plan</h3>
                        <p className="text-muted-foreground">$14.99/month</p>
                        {subscriptionStatus?.isTrialActive && (
                          <p className="text-sm text-green-600 mt-1">
                            ⭐ Pro user - {subscriptionStatus.trialDaysRemaining} days of trial remaining
                          </p>
                        )}
                        {!subscriptionStatus?.isTrialActive && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Next billing: January 25, 2024
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {subscriptionStatus?.isTrialActive ? 'Pro (Trial)' : 'Active'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        Unlimited assignment generation
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        AI-powered charts and graphs
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        Multiple export formats
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        Priority customer support
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <Button variant="outline">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Update Payment Method
                      </Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Trial or expired subscription
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Free Trial</h3>
                        <p className="text-muted-foreground">$0 forever</p>
                        {subscriptionStatus?.isTrialActive && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {subscriptionStatus.trialDaysRemaining} days remaining
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          {subscriptionStatus?.status === 'expired' ? 'Expired' : 'Trial'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        Limited assignment generation
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        Basic AI features
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-gray-400" />
                        <span className="line-through">Advanced export formats</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-gray-400" />
                        <span className="line-through">Priority support</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      {subscriptionStatus?.status !== 'active' && (
                        <Button 
                          onClick={() => setShowPaywall(true)}
                          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Upgrade to Basic - $14.99/month
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Security</h2>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Password</h3>
                        <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                      </div>
                      <Button variant="outline">
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">
                        <Shield className="w-4 h-4 mr-2" />
                        Enable 2FA
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">API Keys</h3>
                        <p className="text-sm text-muted-foreground">Manage your API access</p>
                      </div>
                      <Button variant="outline">
                        <Key className="w-4 h-4 mr-2" />
                        Manage Keys
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Notifications</h2>
                
                <div className="space-y-4">
                  {Object.entries(preferences.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about {key}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleNotificationToggle(key as keyof UserPreferences["notifications"])}
                        className="rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Settings Tab */}
            {activeTab === "export" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Export Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Default Export Format</Label>
                    <select
                      value={preferences.exportFormat}
                      onChange={(e) => setPreferences(prev => ({ 
                        ...prev, 
                        exportFormat: e.target.value as "pdf" | "docx" | "txt" 
                      }))}
                      className="mt-2 px-3 py-2 border border-input rounded-md w-full"
                    >
                      <option value="pdf">PDF</option>
                      <option value="docx">DOCX</option>
                      <option value="txt">TXT</option>
                    </select>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Export History</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download your data or delete your account
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Paywall Modal */}
      <Paywall
        isVisible={showPaywall}
        onUpgrade={handleUpgrade}
        onClose={() => setShowPaywall(false)}
      />
    </div>
  );
};

export default SettingsPage; 