// @ts-nocheck
import { useState } from 'react';
import { useIsCallerAdmin, useGetClassFund, useGetTeacherClass, useGetStudents, useUpdateClassBalance, useUpdateStudent } from '../hooks/useQueries';
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
  const { data: students } = useGetStudents(teacherClass?.id);
  const updateClassBalance = useUpdateClassBalance();
  const updateStudent = useUpdateStudent();
  const { isDemoMode } = useDemo();

  // Shop states
  const [shopOpen, setShopOpen] = useState(false);
  const [shopStep, setShopStep] = useState(1);
  const [selectedPurchaser, setSelectedPurchaser] = useState<string>('');
  const [basket, setBasket] = useState<{ id: string; name: string; emoji: string; price: number; quantity: number }[]>([]);

  // Derive studentsList from students data
  const studentsList = students || [];

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

    // Generate transactions over 4 weeks including weekly salary
    const demoTransactions = [
      // Week 1
      { daysAgo: 28, type: 'salary' as const, amount: 30, ref: 'Weekly classroom salary' },
      { daysAgo: 28, type: 'award' as const, amount: 50, ref: 'Whole class - excellent behaviour' },
      { daysAgo: 27, type: 'award' as const, amount: 21, ref: 'Student contribution - Emma (homework)' },
      { daysAgo: 26, type: 'award' as const, amount: 14, ref: 'Student contribution - James (helping)' },
      { daysAgo: 25, type: 'award' as const, amount: 35, ref: 'Student contribution - Sophie (presentation)' },
      { daysAgo: 24, type: 'expense' as const, amount: -15, ref: 'Weekly classroom supplies' },
      { daysAgo: 23, type: 'award' as const, amount: 28, ref: 'Student contribution - Oliver (teamwork)' },
      { daysAgo: 22, type: 'interest' as const, amount: 3, ref: 'Weekly interest (2%)' },
      // Week 2
      { daysAgo: 21, type: 'salary' as const, amount: 30, ref: 'Weekly classroom salary' },
      { daysAgo: 21, type: 'award' as const, amount: 42, ref: 'Student contribution - Lily (reading)' },
      { daysAgo: 20, type: 'award' as const, amount: 75, ref: 'Whole class - science project' },
      { daysAgo: 19, type: 'shopPurchase' as const, amount: -50, ref: 'Extra break time (15 min)' },
      { daysAgo: 18, type: 'award' as const, amount: 21, ref: 'Student contribution - Harry (maths)' },
      { daysAgo: 17, type: 'expense' as const, amount: -15, ref: 'Weekly classroom supplies' },
      { daysAgo: 16, type: 'award' as const, amount: 35, ref: 'Student contribution - Amelia (art)' },
      { daysAgo: 15, type: 'interest' as const, amount: 5, ref: 'Weekly interest (2%)' },
      // Week 3
      { daysAgo: 14, type: 'salary' as const, amount: 30, ref: 'Weekly classroom salary' },
      { daysAgo: 14, type: 'award' as const, amount: 28, ref: 'Student contribution - George (PE)' },
      { daysAgo: 13, type: 'award' as const, amount: 100, ref: 'Whole class - assembly performance' },
      { daysAgo: 12, type: 'award' as const, amount: 21, ref: 'Student contribution - Isla (spelling)' },
      { daysAgo: 11, type: 'award' as const, amount: 14, ref: 'Student contribution - Jack (tidying)' },
      { daysAgo: 10, type: 'expense' as const, amount: -15, ref: 'Weekly classroom supplies' },
      { daysAgo: 9, type: 'shopPurchase' as const, amount: -100, ref: 'Movie afternoon' },
      { daysAgo: 8, type: 'interest' as const, amount: 7, ref: 'Weekly interest (2%)' },
      // Week 4
      { daysAgo: 7, type: 'salary' as const, amount: 30, ref: 'Weekly classroom salary' },
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
    // Privileges (individual)
    { id: 'p1', name: 'Line leader', emoji: '👑', description: 'Be first in line for a day', price: 10, category: 'Privilege', purchaseType: 'individual' },
    { id: 'p2', name: 'Choose seat', emoji: '💺', description: 'Pick your seat for a week', price: 15, category: 'Privilege', purchaseType: 'individual' },
    { id: 'p3', name: 'First to lunch', emoji: '🍽️', description: 'Skip the queue at lunch', price: 12, category: 'Privilege', purchaseType: 'individual' },
    { id: 'p4', name: "Teacher's helper", emoji: '🌟', description: 'Help teacher for a day', price: 18, category: 'Privilege', purchaseType: 'individual' },
    // Rewards (individual)
    { id: 'r1', name: 'Extra playtime', emoji: '⚽', description: '10 minutes extra play', price: 20, category: 'Reward', purchaseType: 'individual' },
    { id: 'r2', name: 'Homework pass', emoji: '📝', description: 'Skip one homework', price: 25, category: 'Reward', purchaseType: 'individual' },
    { id: 'r3', name: 'Free time', emoji: '🎮', description: '15 minutes free activity', price: 22, category: 'Reward', purchaseType: 'individual' },
    { id: 'r4', name: 'Show & tell', emoji: '🎁', description: 'Extra show & tell slot', price: 15, category: 'Reward', purchaseType: 'individual' },
    // Items (individual)
    { id: 'i1', name: 'Fancy pencil', emoji: '✏️', description: 'Special decorated pencil', price: 8, category: 'Item', purchaseType: 'individual' },
    { id: 'i2', name: 'Stickers', emoji: '⭐', description: 'Pack of 5 stickers', price: 5, category: 'Item', purchaseType: 'individual' },
    { id: 'i3', name: 'Bookmark', emoji: '🔖', description: 'Custom bookmark', price: 10, category: 'Item', purchaseType: 'individual' },
    // Experiences (individual)
    { id: 'e1', name: 'Lunch with teacher', emoji: '🍕', description: 'Special lunch time', price: 30, category: 'Experience', purchaseType: 'individual' },
    { id: 'e2', name: 'Read to class', emoji: '📚', description: 'Read your favorite book', price: 20, category: 'Experience', purchaseType: 'individual' },
    { id: 'e3', name: 'Music choice', emoji: '🎵', description: 'Pick class music', price: 25, category: 'Experience', purchaseType: 'individual' },
    // Class-only items
    { id: 'c1', name: 'Pizza party', emoji: '🍕', description: 'Pizza for the whole class', price: 200, category: 'Class', purchaseType: 'classOnly' },
    { id: 'c2', name: 'Extra break time', emoji: '⏰', description: '15 minutes extra break', price: 50, category: 'Class', purchaseType: 'classOnly' },
    { id: 'c3', name: 'Movie afternoon', emoji: '🎬', description: 'Watch a film together', price: 100, category: 'Class', purchaseType: 'classOnly' },
    { id: 'c4', name: 'Games session', emoji: '🎮', description: 'Board games or outdoor games', price: 75, category: 'Class', purchaseType: 'classOnly' },
    { id: 'c5', name: 'Ice cream treat', emoji: '🍦', description: 'Ice cream for everyone', price: 150, category: 'Class', purchaseType: 'classOnly' },
  ];

  // Shop helper functions
  const getFilteredShopItems = () => {
    if (selectedPurchaser === 'whole-class') {
      return shopItems.filter(item => item.purchaseType === 'classOnly');
    }
    return shopItems.filter(item => item.purchaseType === 'individual');
  };

  const getPurchaserBalance = () => {
    if (selectedPurchaser === 'whole-class') {
      return Number(classFund?.totalAmount || 0);
    }
    const student = studentsList.find(s => s.id === selectedPurchaser);
    return student?.personalBalance || 0;
  };

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

  const handleConfirmPurchase = async () => {
    const total = getBasketTotal();
    const purchaserBalance = getPurchaserBalance();

    if (total > purchaserBalance) {
      toast.error('Insufficient balance!');
      return;
    }

    try {
      if (selectedPurchaser === 'whole-class') {
        await updateClassBalance.mutateAsync({
          adjustment: -total,
          reason: `Shop purchase (${basket.length} items) + VAT`,
        });
      } else {
        const student = studentsList.find(s => s.id === selectedPurchaser);
        if (student) {
          await updateStudent.mutateAsync({
            studentId: student.id,
            personalBalance: student.personalBalance - total,
          });
        }
      }

      const itemNames = basket.map(b => `${b.emoji} ${b.name} x${b.quantity}`).join(', ');
      toast.success(
        `Purchase complete! ${itemNames}. Subtotal: ${getBasketSubtotal()} CC + VAT: ${getBasketVAT()} CC = Total: ${total} CC`,
        { duration: 5000 }
      );

      setShopOpen(false);
      setShopStep(1);
      setSelectedPurchaser('');
      setBasket([]);
    } catch (error) {
      toast.error('Failed to process purchase');
    }
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
                <Icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  Class Bank
                </CardTitle>
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
          setSelectedPurchaser('');
          setBasket([]);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl">
              {shopStep === 1 && '🛒 CubCoin Shop - Who is purchasing?'}
              {shopStep === 2 && '🛍️ Browse Shop'}
              {shopStep === 3 && '📋 Review Basket'}
              {shopStep === 4 && '✅ Confirm Purchase'}
            </DialogTitle>
            <DialogDescription>
              {shopStep === 1 && 'Select who will be making this purchase'}
              {shopStep === 2 && `Shopping for: ${selectedPurchaser === 'whole-class' ? 'Whole Class' : studentsList.find(s => s.id === selectedPurchaser)?.name}`}
              {shopStep === 3 && 'Review your items before purchase'}
              {shopStep === 4 && 'Final confirmation with VAT'}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Select purchaser */}
          {shopStep === 1 && (
            <div className="space-y-4">
              <Select value={selectedPurchaser} onValueChange={setSelectedPurchaser}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select purchaser..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whole-class">🏫 Whole Class (Class Fund)</SelectItem>
                  {studentsList.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.personalBalance} CC)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button
                  disabled={!selectedPurchaser}
                  onClick={() => setShopStep(2)}
                  className="w-full h-11"
                >
                  Continue
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* Step 2: Browse items */}
          {shopStep === 2 && (
            <div className="flex flex-col flex-1 min-h-0 space-y-4">
              <div className="bg-primary/10 p-3 rounded-lg flex justify-between items-center flex-shrink-0">
                <span className="font-medium">Available Balance:</span>
                <span className="text-xl font-bold">{getPurchaserBalance()} CC</span>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
                  {getFilteredShopItems().map(item => (
                    <Card key={item.id} className="border hover:border-amber-300 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{item.emoji}</span>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                              <Badge variant="outline" className="mt-1 text-xs">{item.category}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{item.price} CC</div>
                            <Button size="sm" className="mt-1" onClick={() => addToBasket(item)}>
                              Add
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              <DialogFooter className="flex justify-between flex-shrink-0">
                <Button variant="outline" onClick={() => setShopStep(1)}>← Back</Button>
                <div className="flex items-center gap-2">
                  {basket.length > 0 && (
                    <Badge className="text-sm">{basket.reduce((sum, b) => sum + b.quantity, 0)} items</Badge>
                  )}
                  <Button
                    disabled={basket.length === 0}
                    onClick={() => setShopStep(3)}
                  >
                    View Basket
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}

          {/* Step 3: Review basket */}
          {shopStep === 3 && (
            <div className="space-y-4">
              <div className="border rounded-lg divide-y">
                {basket.map(item => (
                  <div key={item.id} className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.emoji}</span>
                      <span>{item.name} x{item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{item.price * item.quantity} CC</span>
                      <Button size="sm" variant="destructive" onClick={() => removeFromBasket(item.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{getBasketSubtotal()} CC</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>VAT (20%):</span>
                  <span>{getBasketVAT()} CC</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{getBasketTotal()} CC</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span>Current Balance:</span>
                  <span>{getPurchaserBalance()} CC</span>
                </div>
                <div className="flex justify-between">
                  <span>After Purchase:</span>
                  <span className={getPurchaserBalance() >= getBasketTotal() ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {getPurchaserBalance() - getBasketTotal()} CC
                  </span>
                </div>
              </div>

              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShopStep(2)}>Continue Shopping</Button>
                <Button
                  disabled={getPurchaserBalance() < getBasketTotal()}
                  onClick={() => setShopStep(4)}
                >
                  Confirm Order
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* Step 4: Final confirmation */}
          {shopStep === 4 && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  You are about to purchase {basket.reduce((sum, b) => sum + b.quantity, 0)} item(s) for <strong>{selectedPurchaser === 'whole-class' ? 'Whole Class' : studentsList.find(s => s.id === selectedPurchaser)?.name}</strong> for a total of <strong>{getBasketTotal()} CC</strong> (including VAT).
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">Items:</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {basket.map(item => (
                    <Badge key={item.id} variant="secondary" className="text-sm">
                      {item.emoji} {item.name} x{item.quantity}
                    </Badge>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShopStep(3)}>← Back</Button>
                <Button onClick={handleConfirmPurchase} className="bg-green-600 hover:bg-green-700">
                  Complete Purchase
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
