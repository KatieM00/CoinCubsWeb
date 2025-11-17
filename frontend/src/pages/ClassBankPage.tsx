// @ts-nocheck
import { useState } from 'react';
import { useIsCallerAdmin, useGetClassFund, useGetTeacherClass } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ClassTransaction } from '../types';
import CubCoinIcon from '@/assets/CubCoin.png';
import { useDemo } from '@/contexts/DemoContext';

// Simple icon component using CubCoin image
const Icon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <img src={CubCoinIcon} alt="" className={className} />
);

export default function ClassBankPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: classFund, isLoading: fundLoading } = useGetClassFund();
  const { data: teacherClass } = useGetTeacherClass();
  const { isDemoMode } = useDemo();

  // Shop states
  const [shopOpen, setShopOpen] = useState(false);
  const [shopStep, setShopStep] = useState(1);
  const [basket, setBasket] = useState<{ id: string; name: string; emoji: string; price: number; quantity: number }[]>([]);

  // Filter states
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Get class transactions (empty for live, demo data for demo mode)
  const getClassTransactions = (): ClassTransaction[] => {
    if (!isDemoMode) {
      // Live mode - return empty array, transactions will be recorded as they happen
      return [];
    }

    // Demo mode - generate realistic demo data
    const now = new Date();
    const transactions: ClassTransaction[] = [];
    let balance = 0;

    // Generate 35 transactions over 4 weeks
    const demoTransactions = [
      // Week 1
      { daysAgo: 28, type: 'award' as const, amount: 50, ref: 'Whole class - excellent behaviour' },
      { daysAgo: 27, type: 'award' as const, amount: 21, ref: 'Student contribution - Emma (homework)' },
      { daysAgo: 26, type: 'award' as const, amount: 14, ref: 'Student contribution - James (helping)' },
      { daysAgo: 25, type: 'award' as const, amount: 35, ref: 'Student contribution - Sophie (presentation)' },
      { daysAgo: 24, type: 'expense' as const, amount: -15, ref: 'Weekly classroom supplies' },
      { daysAgo: 23, type: 'award' as const, amount: 28, ref: 'Student contribution - Oliver (teamwork)' },
      { daysAgo: 22, type: 'interest' as const, amount: 3, ref: 'Weekly interest (2%)' },
      // Week 2
      { daysAgo: 21, type: 'award' as const, amount: 42, ref: 'Student contribution - Lily (reading)' },
      { daysAgo: 20, type: 'award' as const, amount: 75, ref: 'Whole class - science project' },
      { daysAgo: 19, type: 'shopPurchase' as const, amount: -50, ref: 'Extra break time (15 min)' },
      { daysAgo: 18, type: 'award' as const, amount: 21, ref: 'Student contribution - Harry (maths)' },
      { daysAgo: 17, type: 'expense' as const, amount: -15, ref: 'Weekly classroom supplies' },
      { daysAgo: 16, type: 'award' as const, amount: 35, ref: 'Student contribution - Amelia (art)' },
      { daysAgo: 15, type: 'interest' as const, amount: 5, ref: 'Weekly interest (2%)' },
      // Week 3
      { daysAgo: 14, type: 'award' as const, amount: 28, ref: 'Student contribution - George (PE)' },
      { daysAgo: 13, type: 'award' as const, amount: 100, ref: 'Whole class - assembly performance' },
      { daysAgo: 12, type: 'award' as const, amount: 21, ref: 'Student contribution - Isla (spelling)' },
      { daysAgo: 11, type: 'award' as const, amount: 14, ref: 'Student contribution - Jack (tidying)' },
      { daysAgo: 10, type: 'expense' as const, amount: -15, ref: 'Weekly classroom supplies' },
      { daysAgo: 9, type: 'shopPurchase' as const, amount: -100, ref: 'Movie afternoon' },
      { daysAgo: 8, type: 'interest' as const, amount: 7, ref: 'Weekly interest (2%)' },
      // Week 4
      { daysAgo: 7, type: 'award' as const, amount: 35, ref: 'Student contribution - Mia (writing)' },
      { daysAgo: 6, type: 'award' as const, amount: 42, ref: 'Student contribution - Noah (science)' },
      { daysAgo: 5, type: 'award' as const, amount: 50, ref: 'Whole class - golden time earned' },
      { daysAgo: 4, type: 'award' as const, amount: 28, ref: 'Student contribution - Ava (music)' },
      { daysAgo: 3, type: 'expense' as const, amount: -15, ref: 'Weekly classroom supplies' },
      { daysAgo: 2, type: 'award' as const, amount: 21, ref: 'Student contribution - Ethan (history)' },
      { daysAgo: 1, type: 'interest' as const, amount: 9, ref: 'Weekly interest (2%)' },
      { daysAgo: 0, type: 'award' as const, amount: 35, ref: 'Student contribution - Grace (geography)' },
    ];

    // Build transactions with running balance
    demoTransactions.forEach((tx, index) => {
      balance += tx.amount;
      const date = new Date(now);
      date.setDate(date.getDate() - tx.daysAgo);

      transactions.push({
        id: `tx-${index}`,
        transactionType: tx.type,
        amount: tx.amount,
        reference: tx.ref,
        balanceAfter: balance,
        timestamp: date.toISOString(),
        category: tx.type === 'expense' ? 'supplies' : undefined,
      });
    });

    return transactions;
  };

  const allTransactions = getClassTransactions();

  // Filter transactions by date
  const getFilteredTransactions = () => {
    let filtered = [...allTransactions];
    const now = new Date();

    if (dateFilter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(tx => new Date(tx.timestamp) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(tx => new Date(tx.timestamp) >= monthAgo);
    }

    // Sort
    if (sortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  // Format date as DD/MM/YYYY
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Shop items
  const shopItems = [
    // Privileges (individual - but we only show class-only in class bank)
    // Class-only items
    { id: 'c1', name: 'Pizza party', emoji: '🍕', description: 'Pizza for the whole class', price: 200, category: 'Class', purchaseType: 'classOnly' },
    { id: 'c2', name: 'Extra break time', emoji: '⏰', description: '15 minutes extra break', price: 50, category: 'Class', purchaseType: 'classOnly' },
    { id: 'c3', name: 'Movie afternoon', emoji: '🎬', description: 'Watch a film together', price: 100, category: 'Class', purchaseType: 'classOnly' },
    { id: 'c4', name: 'Games session', emoji: '🎮', description: 'Board games or outdoor games', price: 75, category: 'Class', purchaseType: 'classOnly' },
    { id: 'c5', name: 'Ice cream treat', emoji: '🍦', description: 'Ice cream for everyone', price: 150, category: 'Class', purchaseType: 'classOnly' },
  ];

  const addToBasket = (item: typeof shopItems[0]) => {
    setBasket(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, emoji: item.emoji, price: item.price, quantity: 1 }];
    });
  };

  const removeFromBasket = (itemId: string) => {
    setBasket(prev => prev.filter(i => i.id !== itemId));
  };

  const getBasketSubtotal = () => basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const getBasketVAT = () => Math.round(getBasketSubtotal() * 0.2);
  const getBasketTotal = () => getBasketSubtotal() + getBasketVAT();

  const handleConfirmPurchase = () => {
    const total = getBasketTotal();
    const currentBalance = Number(classFund?.totalAmount || 0);

    if (total > currentBalance) {
      toast.error('Insufficient class funds for this purchase');
      return;
    }

    // TODO: Record actual transaction when backend is connected
    toast.success(`Purchase confirmed! ${total} CC deducted from class fund.`);
    setBasket([]);
    setShopStep(1);
    setShopOpen(false);
  };

  if (adminLoading || fundLoading) {
    return (
      <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8 max-w-4xl space-y-4 md:space-y-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>
            Only teachers can access the Class Bank page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentBalance = Number(classFund?.totalAmount || 0);

  return (
    <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8 max-w-4xl space-y-4 md:space-y-6 pb-8">
      {/* Header Card */}
      <Card className="border-amber-300 shadow-xl">
        <CardHeader className="pb-3 md:pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-xl md:text-2xl">🏦</span>
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl">Class Bank</CardTitle>
                <CardDescription className="text-sm md:text-base">Complete transaction history for your class fund</CardDescription>
              </div>
            </div>
            <Button onClick={() => setShopOpen(true)} className="gap-2 h-11 md:h-10">
              <span className="text-lg">🛒</span>
              Open Shop
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 md:p-6 border border-amber-200">
            <div className="flex items-center justify-center gap-3">
              <Icon className="w-8 h-8 md:w-10 md:h-10" />
              <div className="text-center">
                <p className="text-sm md:text-base text-amber-700 font-medium">Class Fund Balance</p>
                <p className="text-3xl md:text-4xl font-bold text-amber-900">{currentBalance.toLocaleString()} CC</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History Card */}
      <Card className="border-gray-200 shadow-lg">
        <CardHeader className="pb-3 md:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg md:text-xl">Transaction History</CardTitle>
            <div className="flex gap-2">
              <Select value={dateFilter} onValueChange={(v: 'all' | 'week' | 'month') => setDateFilter(v)}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(v: 'newest' | 'oldest') => setSortOrder(v)}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right w-[100px]">Amount</TableHead>
                    <TableHead className="text-right w-[120px]">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                        <div className="space-y-2">
                          <p className="text-base">No transactions yet.</p>
                          <p className="text-sm">Award CubCoins to start building your class fund!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-sm">{formatDate(tx.timestamp)}</TableCell>
                        <TableCell>{tx.reference}</TableCell>
                        <TableCell className={`text-right font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount >= 0 ? '+' : ''}{tx.amount} CC
                        </TableCell>
                        <TableCell className="text-right font-mono">{tx.balanceAfter} CC</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <div className="space-y-2">
                  <p className="text-base">No transactions yet.</p>
                  <p className="text-sm">Award CubCoins to start building your class fund!</p>
                </div>
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <Card key={tx.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-muted-foreground font-mono">{formatDate(tx.timestamp)}</span>
                      <Badge variant={tx.amount >= 0 ? 'default' : 'destructive'} className="font-semibold">
                        {tx.amount >= 0 ? '+' : ''}{tx.amount} CC
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{tx.reference}</p>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Balance: </span>
                      <span className="font-mono font-semibold">{tx.balanceAfter} CC</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {filteredTransactions.length > 50 && (
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">Showing first 50 transactions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shop Dialog */}
      <Dialog open={shopOpen} onOpenChange={(open) => {
        setShopOpen(open);
        if (!open) {
          setShopStep(1);
          setBasket([]);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl">
              {shopStep === 1 && '🛒 Class Shop'}
              {shopStep === 2 && '🛍️ Your Basket'}
              {shopStep === 3 && '✅ Confirm Purchase'}
            </DialogTitle>
            <DialogDescription>
              {shopStep === 1 && 'Choose items for your class (class fund purchases only)'}
              {shopStep === 2 && 'Review your selected items'}
              {shopStep === 3 && 'Confirm your purchase with VAT'}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Browse items */}
          {shopStep === 1 && (
            <>
              <ScrollArea className="h-[400px] flex-1">
                <div className="space-y-4 pr-4">
                  <div>
                    <h4 className="font-semibold mb-3">Class Rewards</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {shopItems.map((item) => (
                        <Card key={item.id} className="border hover:border-amber-300 transition-colors">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-2xl">{item.emoji}</span>
                                  <span className="font-semibold">{item.name}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                                <Badge variant="outline" className="font-mono">{item.price} CC</Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addToBasket(item)}
                                className="h-9 w-9 p-0"
                              >
                                +
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="flex-shrink-0 mt-4">
                <div className="flex justify-between w-full items-center">
                  <p className="text-sm text-muted-foreground">
                    {basket.length > 0 ? `${basket.reduce((sum, i) => sum + i.quantity, 0)} items in basket` : 'No items selected'}
                  </p>
                  <Button
                    onClick={() => setShopStep(2)}
                    disabled={basket.length === 0}
                    className="gap-2"
                  >
                    View Basket
                    <span>→</span>
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}

          {/* Step 2: Review basket */}
          {shopStep === 2 && (
            <>
              <ScrollArea className="h-[350px] flex-1">
                <div className="space-y-3 pr-4">
                  {basket.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold">{item.price * item.quantity} CC</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromBasket(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <DialogFooter className="flex-shrink-0 mt-4">
                <div className="flex justify-between w-full">
                  <Button variant="outline" onClick={() => setShopStep(1)}>
                    ← Back
                  </Button>
                  <Button onClick={() => setShopStep(3)} className="gap-2">
                    Checkout
                    <span>→</span>
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}

          {/* Step 3: Confirm with VAT */}
          {shopStep === 3 && (
            <>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono">{getBasketSubtotal()} CC</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>VAT (20%):</span>
                    <span className="font-mono">{getBasketVAT()} CC</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="font-mono">{getBasketTotal()} CC</span>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-sm">
                    <span className="font-semibold">Class Fund Balance:</span>{' '}
                    <span className="font-mono">{currentBalance} CC</span>
                  </p>
                  {getBasketTotal() > currentBalance && (
                    <p className="text-red-600 text-sm mt-1 font-semibold">
                      Insufficient funds! Need {getBasketTotal() - currentBalance} more CC.
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter className="flex-shrink-0 mt-4">
                <div className="flex justify-between w-full">
                  <Button variant="outline" onClick={() => setShopStep(2)}>
                    ← Back
                  </Button>
                  <Button
                    onClick={handleConfirmPurchase}
                    disabled={getBasketTotal() > currentBalance}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    ✓ Confirm Purchase
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
