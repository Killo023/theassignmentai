# Together AI Configuration Guide

## 🚀 Quick Setup

### 1. Get Your Together AI API Key

1. Visit [Together AI](https://together.ai/)
2. Sign up for a free account
3. Navigate to your API keys section
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# Together AI Configuration
NEXT_PUBLIC_TOGETHER_API_KEY=your_actual_api_key_here
```

### 3. Available Models

The application is configured to use these Together AI models with fallback support:

- **Primary**: `meta-llama/Llama-2-70b-chat-hf` (Best quality)
- **Secondary**: `meta-llama/Llama-2-13b-chat-hf` (Fast, good quality)
- **Vision**: `meta-llama/Llama-Vision-Free` (For image analysis)

### 4. Configuration Details

#### API Endpoint
- **Base URL**: `https://api.together.xyz/v1`
- **Completions**: `https://api.together.xyz/v1/completions`

#### Model Parameters
```javascript
{
  model: 'meta-llama/Llama-2-70b-chat-hf',
  prompt: prompt,
  max_tokens: maxTokens,
  temperature: 0.2,        // Lower for focused outputs
  top_p: 0.85,            // Nucleus sampling
  frequency_penalty: 0.2,  // Reduce repetition
  presence_penalty: 0.2,   // Encourage diversity
  stop: ['\n\n\n\n', 'END_OF_ASSIGNMENT', '---', 'CONCLUSION:', 'References:']
}
```

### 5. Testing Your Configuration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit the environment test page:
   ```
   http://localhost:3000/env-test
   ```

3. Check if `NEXT_PUBLIC_TOGETHER_API_KEY` shows "Set (hidden)"

### 6. Testing AI Generation

1. Go to the assignment creation page:
   ```
   http://localhost:3000/dashboard/new
   ```

2. Fill out the assignment form and submit

3. Check the browser console for any API errors

### 7. Troubleshooting

#### Common Issues

**Issue**: "API key not configured"
- **Solution**: Ensure `NEXT_PUBLIC_TOGETHER_API_KEY` is set in `.env.local`

**Issue**: "All AI models failed to generate content"
- **Solution**: 
  - Check your API key is valid
  - Verify you have sufficient credits
  - Check the browser console for specific error messages

**Issue**: Repetitive or low-quality content
- **Solution**: The system automatically detects and retries with different models

#### Error Codes

- **401**: Invalid API key
- **429**: Rate limit exceeded
- **500**: Server error (try again)

### 8. Advanced Configuration

#### Custom Model Selection

You can modify the model selection in `src/lib/ai-service.ts`:

```typescript
const models = [
  'meta-llama/Llama-2-70b-chat-hf',    // Best quality
  'meta-llama/Llama-2-13b-chat-hf',    // Fast, good quality
  'meta-llama/Llama-Vision-Free'        // Vision capabilities
];
```

#### Adjusting Parameters

Modify the AI generation parameters in the `callTogetherAI` method:

```typescript
{
  temperature: 0.2,        // 0.0-1.0 (lower = more focused)
  top_p: 0.85,            // 0.0-1.0 (nucleus sampling)
  frequency_penalty: 0.2,  // Reduce repetition
  presence_penalty: 0.2    // Encourage diversity
}
```

### 9. Free Tier Limits

Together AI offers:
- **Free tier**: 25 requests per day
- **Paid plans**: Higher limits and priority access

### 10. Security Notes

- Never commit your API key to version control
- Use environment variables for all sensitive data
- The API key is exposed to the client (NEXT_PUBLIC_) for frontend usage

### 11. Support

- **Together AI Documentation**: https://docs.together.ai/
- **API Reference**: https://docs.together.ai/reference
- **Community**: https://discord.gg/together-ai

## ✅ Verification Checklist

- [ ] Together AI account created
- [ ] API key generated and copied
- [ ] `.env.local` file created with API key
- [ ] Development server restarted
- [ ] Environment test page shows "Set (hidden)" for API key
- [ ] Assignment generation test successful
- [ ] No console errors during generation

## 🎯 Next Steps

After configuring Together AI:

1. Test assignment generation
2. Configure other services (PayPal, MailerLite)
3. Deploy to production
4. Monitor API usage and costs 