import { GoogleGenerativeAI } from '@google/generative-ai';

// Category mappings
const expenseCategories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Other',
];

const incomeCategories = [
  'Salary',
  'Freelance',
  'Investments',
  'Other',
];

// Initialize Gemini client only if API key exists
let genAI: GoogleGenerativeAI | null = null;

const getGeminiClient = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

export const categorizeTransaction = async (
  description: string,
  amount: number,
  type: 'income' | 'expense'
): Promise<string> => {
  try {
    // If no description, return default category
    if (!description || description.trim() === '') {
      return 'Other';
    }

    // Check if Gemini is configured
    const client = getGeminiClient();
    if (!client) {
      console.log('Gemini API key not configured, using fallback');
      return 'Other';
    }

    const categories = type === 'income' ? incomeCategories : expenseCategories;

    const prompt = `You are a financial assistant. Categorize the following transaction into ONE of these categories: ${categories.join(', ')}.

Transaction details:
- Description: "${description}"
- Amount: $${amount}
- Type: ${type}

Respond with ONLY the category name from the list above, nothing else. No explanation.`;

    const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestedCategory = response.text().trim();

    // Validate that the suggested category is in our list
    if (categories.includes(suggestedCategory)) {
      console.log(`AI categorized "${description}" as: ${suggestedCategory}`);
      return suggestedCategory;
    } else {
      console.log(`AI suggested: ${suggestedCategory}, checking for partial match...`);
      
      // Try to find a partial match (sometimes AI adds extra words)
      const match = categories.find(cat => 
        suggestedCategory.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(suggestedCategory.toLowerCase())
      );
      
      if (match) {
        console.log(`Found match: ${match}`);
        return match;
      }
      
      console.log(`Using fallback: Other`);
      return 'Other';
    }
  } catch (error: any) {
    console.error('AI categorization error:', error.message);
    return 'Other';
  }
};