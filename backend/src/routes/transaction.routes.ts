import express, { Response } from 'express';
import Transaction from '../models/Transaction';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { categorizeTransaction } from '../services/ai';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/transactions/suggest-category - AI suggest category (NEW!)
router.post('/suggest-category', async (req: AuthRequest, res: Response) => {
  try {
    const { description, amount, type } = req.body;

    if (!description || !type) {
      return res.status(400).json({ error: 'Description and type are required' });
    }

    console.log(`AI categorizing: "${description}"`);
    const suggestedCategory = await categorizeTransaction(description, amount || 0, type);

    res.json({ category: suggestedCategory });
  } catch (error: any) {
    console.error('Error suggesting category:', error);
    res.status(500).json({ error: 'Error suggesting category', category: 'Other' });
  }
});

// GET /api/transactions - Get all transactions for logged-in user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    console.log('Fetching transactions for user:', req.userId);
    const { category, startDate, endDate } = req.query;
    
    const filter: any = { userId: req.userId };
    
    if (category) {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    console.log(`Found ${transactions.length} transactions`);
    
    res.json(transactions);
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// POST /api/transactions - Create new transaction
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    console.log('➕ Creating transaction for user:', req.userId);
    const { type, amount, category, description, date } = req.body;

    // Validation
    if (!type || !amount || !category) {
      return res.status(400).json({ error: 'Type, amount, and category are required' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be income or expense' });
    }

    const transaction = new Transaction({
      userId: req.userId,
      type,
      amount,
      category,
      description: description || '',
      date: date || new Date(),
    });

    await transaction.save();
    console.log('Transaction created successfully');
    
    res.status(201).json(transaction);
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

// GET /api/transactions/stats/summary - Get summary statistics
router.get('/stats/summary', async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });

    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: transactions.length,
    };

    transactions.forEach((t) => {
      if (t.type === 'income') {
        summary.totalIncome += t.amount;
      } else {
        summary.totalExpense += t.amount;
      }
    });

    summary.balance = summary.totalIncome - summary.totalExpense;

    res.json(summary);
  } catch (error: any) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Error fetching summary' });
  }
});

// GET /api/transactions/:id - Get single transaction
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error: any) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Error fetching transaction' });
  }
});

// PUT /api/transactions/:id - Update transaction
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { type, amount, category, description, date },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error: any) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Error updating transaction' });
  }
});

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error: any) {
    console.error(' Error deleting transaction:', error);
    res.status(500).json({ error: 'Error deleting transaction' });
  }
});

export default router;