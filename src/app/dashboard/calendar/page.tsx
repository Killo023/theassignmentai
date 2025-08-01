"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import PaymentService from "@/lib/payment-service";
import { AssignmentService } from "@/lib/assignment-service";
import { Calendar, Plus, Edit, Trash2, Clock, AlertTriangle, CheckCircle, X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import FeatureRestriction from "@/components/assignment/FeatureRestriction";
import Link from "next/link";

interface AssignmentEvent {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  subject: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

const CalendarPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<AssignmentEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AssignmentEvent | null>(null);
  const [hasCalendarAccess, setHasCalendarAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const paymentService = PaymentService.getInstance();
  const assignmentService = user ? new AssignmentService(user.id) : null;

  useEffect(() => {
    const initializeCalendar = async () => {
      await checkCalendarAccess();
      await loadEvents();
    };
    
    if (user?.id) {
      initializeCalendar();
    }
  }, [user]);

  const checkCalendarAccess = async () => {
    if (!user?.id) return;
    
    try {
      const canAccess = await paymentService.canAccessCalendar(user.id);
      setHasCalendarAccess(canAccess);
    } catch (error) {
      console.error("Error checking calendar access:", error);
      setHasCalendarAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvents = async () => {
    if (!user?.id || !assignmentService) return;
    
    try {
      // Load assignments from database and convert to calendar events
      const assignments = await assignmentService.getAssignments();
      const calendarEvents: AssignmentEvent[] = assignments.map(assignment => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.requirements || '',
        dueDate: assignment.due_date || new Date().toISOString().split('T')[0],
        subject: assignment.subject,
        type: assignment.type,
        priority: assignment.word_count > 2000 ? 'high' : assignment.word_count > 1000 ? 'medium' : 'low',
        status: assignment.status,
        createdAt: assignment.created_at,
        updatedAt: assignment.updated_at,
      }));
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const saveEvents = async (newEvents: AssignmentEvent[]) => {
    if (!user?.id || !assignmentService) return;
    
    try {
      // Update assignments in database with due dates
      for (const event of newEvents) {
        await assignmentService.updateAssignment(event.id, {
          due_date: event.dueDate,
          status: event.status,
        });
      }
      
      setEvents(newEvents);
    } catch (error) {
      console.error("Error saving events:", error);
    }
  };

  const addEvent = async (eventData: Omit<AssignmentEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!assignmentService) return;
    
    try {
      // Create new assignment in database
      const newAssignment = await assignmentService.createAssignment({
        title: eventData.title,
        subject: eventData.subject,
        type: eventData.type,
        status: eventData.status,
        word_count: 0,
        due_date: eventData.dueDate,
        requirements: eventData.description,
      });
      
      if (newAssignment) {
        const newEvent: AssignmentEvent = {
          ...eventData,
          id: newAssignment.id,
          createdAt: newAssignment.created_at,
          updatedAt: newAssignment.updated_at,
        };
        
        setEvents(prev => [...prev, newEvent]);
      }
      
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<AssignmentEvent>) => {
    if (!assignmentService) return;
    
    try {
      await assignmentService.updateAssignment(eventId, {
        title: eventData.title,
        subject: eventData.subject,
        type: eventData.type,
        status: eventData.status,
        due_date: eventData.dueDate,
        requirements: eventData.description,
      });
      
      const updatedEvents = events.map(event => 
        event.id === eventId 
          ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
          : event
      );
      setEvents(updatedEvents);
      setEditingEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!assignmentService) return;
    
    try {
      await assignmentService.deleteAssignment(eventId);
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.dueDate === dateString);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-20 sm:h-24 bg-gray-50 border border-gray-200"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      
      days.push(
        <div
          key={day}
          className={`h-20 sm:h-24 border border-gray-200 p-1 cursor-pointer transition-colors ${
            isToday ? 'bg-blue-50 border-blue-300' : ''
          } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-xs sm:text-sm font-medium mb-1">{day}</div>
          <div className="space-y-0.5">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded border ${getPriorityColor(event.priority)} truncate`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const renderEventList = () => {
    const selectedDateEvents = getEventsForDate(selectedDate);
    
    return (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-lg font-semibold">
            Events for {formatDate(selectedDate)}
          </h3>
          <Button size="sm" onClick={() => setShowAddDialog(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
        
        {selectedDateEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No events scheduled for this date</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDateEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.subject} • {event.type}</p>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-2">{event.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(event.priority)}`}>
                        {event.priority} priority
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Event</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{event.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteEvent(event.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <FeatureRestriction
      userId={user?.id}
      feature="calendar"
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Calendar Access Required</h1>
              <p className="text-gray-600 mb-6">
                Upgrade to Basic Plan or higher to access the calendar feature and track your assignment due dates.
              </p>
              <Button asChild className="bg-gradient-to-r from-primary to-purple-600">
                <Link href="/upgrade">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Basic Plan
                </Link>
              </Button>
            </div>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4">
              <X className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Assignment Calendar
            </h1>
            <p className="text-gray-600">
              Track and manage your assignment due dates with our comprehensive calendar system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    >
                      Previous
                    </Button>
                    <span className="text-lg font-medium">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  {renderCalendar()}
                </div>
              </div>
            </div>

            {/* Event List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
                {renderEventList()}
              </div>
            </div>
          </div>
        </div>

        {/* Add Event Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Assignment Event</DialogTitle>
              <DialogDescription>
                Create a new assignment event to track your due dates.
              </DialogDescription>
            </DialogHeader>
            <AddEventForm
              selectedDate={selectedDate}
              onSubmit={addEvent}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Assignment Event</DialogTitle>
              <DialogDescription>
                Update your assignment event details.
              </DialogDescription>
            </DialogHeader>
            {editingEvent && (
              <EditEventForm
                event={editingEvent}
                onSubmit={(data) => updateEvent(editingEvent.id, data)}
                onCancel={() => setEditingEvent(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </FeatureRestriction>
  );
};

// Add Event Form Component
interface AddEventFormProps {
  selectedDate: Date;
  onSubmit: (data: Omit<AssignmentEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ selectedDate, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    type: '',
    dueDate: selectedDate.toISOString().split('T')[0],
    priority: 'medium' as const,
    status: 'pending' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.type) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Assignment Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter assignment title"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g., Mathematics"
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type *</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="e.g., Essay"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date *</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: 'low' | 'medium' | 'high') => 
              setFormData({ ...formData, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'pending' | 'in-progress' | 'completed') => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add any additional notes..."
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Event</Button>
      </DialogFooter>
    </form>
  );
};

// Edit Event Form Component
interface EditEventFormProps {
  event: AssignmentEvent;
  onSubmit: (data: Partial<AssignmentEvent>) => void;
  onCancel: () => void;
}

const EditEventForm: React.FC<EditEventFormProps> = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description || '',
    subject: event.subject,
    type: event.type,
    dueDate: event.dueDate,
    priority: event.priority,
    status: event.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.type) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-title">Assignment Title *</Label>
        <Input
          id="edit-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter assignment title"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-subject">Subject *</Label>
          <Input
            id="edit-subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g., Mathematics"
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-type">Type *</Label>
          <Input
            id="edit-type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="e.g., Essay"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-dueDate">Due Date *</Label>
        <Input
          id="edit-dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: 'low' | 'medium' | 'high') => 
              setFormData({ ...formData, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="edit-status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'pending' | 'in-progress' | 'completed') => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add any additional notes..."
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Update Event</Button>
      </DialogFooter>
    </form>
  );
};

export default CalendarPage; 