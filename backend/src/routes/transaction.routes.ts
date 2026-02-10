import express, { Response } from 'express';
import Transaction from '../models/Transaction';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/transactions - Get all transactions for logged-in user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    console.log('📊 Fetching transactions for user:', req.userId);
    const { category, startDate, endDate } = req.query;
    
    // Build filter query
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
    console.log(`✅ Found ${transactions.length} transactions`);
    
    res.json(transactions);
  } catch (error: any) {
    console.error('❌ Error fetching transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// POST /api/transactions - Create new transaction
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    console.log('➕ Creating transaction for user:', req.userId);
    console.log('📝 Transaction data:', req.body);
    
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
    console.log('✅ Transaction created successfully:', transaction._id);
    
    res.status(201).json(transaction);
  } catch (error: any) {
    console.error('❌ Error creating transaction:', error);
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

// GET /api/transactions/stats/summary - Get summary statistics (MUST BE BEFORE /:id route)
router.get('/stats/summary', async (req: AuthRequest, res: Response) => {
  try {
    console.log('📈 Fetching summary for user:', req.userId);
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
    console.log('✅ Summary calculated:', summary);

    res.json(summary);
  } catch (error: any) {
    console.error('❌ Error fetching summary:', error);
    res.status(500).json({ error: 'Error fetching summary' });
  }
});

// GET /api/transactions/:id - Get single transaction
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId, // Ensure user owns this transaction
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error: any) {
    console.error('❌ Error fetching transaction:', error);
    res.status(500).json({ error: 'Error fetching transaction' });
  }
});

// PUT /api/transactions/:id - Update transaction
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    console.log('✏️ Updating transaction:', req.params.id);
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { type, amount, category, description, date },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    console.log('✅ Transaction updated successfully');
    res.json(transaction);
  } catch (error: any) {
    console.error('❌ Error updating transaction:', error);
    res.status(500).json({ error: 'Error updating transaction' });
  }
});

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    console.log('🗑️ Deleting transaction:', req.params.id);
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    console.log('✅ Transaction deleted successfully');
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting transaction:', error);
    res.status(500).json({ error: 'Error deleting transaction' });
  }
});

export default router;