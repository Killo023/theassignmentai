# The Assignment AI - AI-Powered Assignment Creation System

A modern, AI-powered academic assignment creation platform built with Next.js 14, Together AI, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **AI-Powered Assignment Generation** - Create high-quality academic assignments using Together AI
- **Real-time Chat Interface** - Interactive AI assistant for assignment refinement
- **Multi-format Export** - Export assignments as DOCX, PDF, or copy to clipboard
- **Assignment Management** - Organize and track your academic work
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### AI Integration
- **Together AI Integration** - Free LLM access for assignment generation
- **Restricted Model Usage** - Only uses specified free LLMs for cost control
- **Smart Prompts** - Context-aware AI responses based on assignment details
- **Citation Generation** - Automatic APA-style citations and references
- **Content Refinement** - AI-powered suggestions for improvement

### User Experience
- **Modern UI/UX** - Beautiful, intuitive interface with Framer Motion animations
- **Dark/Light Mode** - Toggle between themes
- **Real-time Preview** - Live preview of assignment content
- **Progress Tracking** - Monitor assignment status and completion

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Framer Motion
- **AI Integration**: Together AI (Llama 3.2 11B Vision)
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Development**: ESLint, Prettier

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aiassignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Together AI Configuration
   NEXT_PUBLIC_TOGETHER_API_KEY=your_together_ai_api_key_here
   
   # Supabase Configuration (for future use)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # PayPal Configuration (for future use)
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
   ```

4. **Get Together AI API Key**
   - Visit [Together AI](https://together.ai/)
   - Sign up for a free account
   - Get your API key from the dashboard
   - Add it to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤖 AI Model Configuration

### Restricted Model Usage

This application is configured to use only specific free LLMs through Together.ai to ensure cost-effective operation:

#### Available Models
- **Arcee AI**: `AFM-4.5B`, `chat`
- **Meta**: `Meta Llama Vision Free`, `chat`, `Meta Llama 3.3 70B Instruct Turbo Free`
- **DeepSeek**: `DeepSeek R1 Distill Llama 70B Free`, `chat`
- **LG AI**: `EXAONE Deep 32B`, `chat`, `EXAONE 3.5 32B Instruct`

#### Model Selection Logic
1. **API Validation**: Checks available models from Together.ai
2. **Filtering**: Only uses models from the allowed list
3. **Fallback**: If API is unavailable, uses the predefined list
4. **Error Handling**: Provides clear error messages if no models are available

#### Testing Model Restrictions
Visit `/test-restricted-models` to verify that only the specified models are being used.

## 🎯 Usage

### Creating a New Assignment

1. **Navigate to Dashboard**
   - Go to `/dashboard` to access the main dashboard
   - Click "New Assignment" or navigate to `/dashboard/new`

2. **Fill Assignment Details**
   - Enter assignment title
   - Select subject from the dropdown
   - Choose assignment type (Research Paper, Essay, etc.)
   - Set target word count

3. **Generate Content**
   - Use the "Generate Assignment" button for quick generation
   - Or chat with the AI assistant for more control
   - Describe your requirements in the chat interface

4. **Refine and Export**
   - Preview your assignment in real-time
   - Make refinements through the chat interface
   - Export as DOCX, PDF, or copy to clipboard

### AI Assistant Features

- **Smart Generation**: AI understands context and generates appropriate content
- **Interactive Refinement**: Chat with AI to improve your assignment
- **Citation Help**: Get automatic citations and references
- **Writing Tips**: Receive guidance on academic writing

## 📁 Project Structure

```
aiassignment/
├── src/
│   ├── app/
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── layout.tsx      # Dashboard layout
│   │   │   ├── page.tsx        # Main dashboard
│   │   │   └── new/            # Assignment creation
│   │   │       └── page.tsx
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── DashboardHeader.tsx
│   │   │   └── DashboardSidebar.tsx
│   │   ├── landing/            # Landing page components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeatureGrid.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── ...
│   │   ├── navigation/         # Navigation components
│   │   │   ├── MainNav.tsx
│   │   │   └── MobileNav.tsx
│   │   └── ui/                 # Shadcn/ui components
│   └── lib/
│       ├── ai-service.ts       # Together AI integration
│       ├── supabase-client.ts  # Supabase client (future)
│       └── utils.ts            # Utility functions
├── public/
│   └── images/                 # Image assets
└── package.json
```

## 🔧 Configuration

### Together AI Setup

1. **Model Selection**: The system uses `meta-llama/Llama-3.2-11B-Vision-Instruct` by default
2. **API Limits**: Configured for optimal performance with reasonable token limits
3. **Fallback**: Includes fallback responses when API is unavailable

### Customization

- **Themes**: Modify colors in `tailwind.config.js`
- **AI Prompts**: Customize prompts in `src/lib/ai-service.ts`
- **Components**: Extend Shadcn/ui components as needed

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Push your code to GitHub
   - Connect repository to Vercel

2. **Environment Variables**
   - Add environment variables in Vercel dashboard
   - Include `NEXT_PUBLIC_TOGETHER_API_KEY`

3. **Deploy**
   - Vercel will automatically deploy on push
   - Monitor deployment in Vercel dashboard

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security

- **API Key Protection**: Environment variables for sensitive data
- **Input Validation**: Client and server-side validation
- **Rate Limiting**: Implemented in AI service
- **Error Handling**: Graceful fallbacks for API failures

## 📈 Performance

- **Optimized Images**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching**: Efficient caching strategies
- **Bundle Analysis**: Monitor bundle size with `@next/bundle-analyzer`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions for help and ideas

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Landing page with modern design
- ✅ Dashboard with assignment management
- ✅ AI-powered assignment generation
- ✅ Real-time chat interface
- ✅ Multi-format export

### Phase 2 (Next)
- 🔄 User authentication with Supabase
- 🔄 Assignment history and favorites
- 🔄 Collaborative editing
- 🔄 Advanced AI features

### Phase 3 (Future)
- 📋 PayPal integration for premium features
- 📋 Advanced analytics and insights
- 📋 Mobile app development
- 📋 API for third-party integrations

## 🙏 Acknowledgments

- **Together AI** for providing free LLM access
- **Vercel** for the Next.js framework
- **Shadcn/ui** for beautiful UI components
- **Framer Motion** for smooth animations
- **Tailwind CSS** for utility-first styling

---

**Built with ❤️ for students and educators worldwide**
