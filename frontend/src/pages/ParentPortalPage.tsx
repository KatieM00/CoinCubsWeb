// @ts-nocheck
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  BookOpen, 
  CreditCard, 
  FileText, 
  User, 
  Award, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Bell,
  Mail,
  Smartphone,
  Lock
} from 'lucide-react';
import { useGetCurriculumProgress, useGetClassAchievements } from '../hooks/useQueries';

export default function ParentPortalPage() {
  const [activeTab, setActiveTab] = useState('learning');
  const [selectedChild] = useState('Emma Johnson');
  
  const { data: curriculumProgress } = useGetCurriculumProgress();
  const { data: achievements } = useGetClassAchievements();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Welcome Back!
        </h1>
        <p className="text-lg text-muted-foreground">
          Stay connected with your child's learning journey
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="learning" className="gap-2 py-3">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Learning</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2 py-3">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="forms" className="gap-2 py-3">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Forms</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2 py-3">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
        </TabsList>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Learning Progress</CardTitle>
                  <CardDescription>Track {selectedChild}'s educational journey</CardDescription>
                </div>
                <Award className="w-8 h-8 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Week Overview */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      Week {curriculumProgress?.currentWeek.toString() || '1'}: Financial Literacy
                    </h3>
                    <p className="text-blue-700 mb-4">
                      This week, the class is learning about <strong>earning and saving</strong>. 
                      Students are exploring how to make good financial decisions and work together 
                      toward shared goals.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Teamwork
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Decision Making
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Community Goals
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Child's Contributions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  {selectedChild}'s Positive Contributions
                </h3>
                <div className="space-y-3">
                  <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-green-900">Helped a classmate with math</p>
                          <p className="text-sm text-green-700 mt-1">
                            Emma showed great teamwork by helping another student understand fractions. 
                            This earned 10 ClassGems for the class fund!
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">2 days ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-green-900">Perfect homework completion</p>
                          <p className="text-sm text-green-700 mt-1">
                            Excellent work on the weekly assignment! Emma's dedication contributed 
                            15 ClassGems to help the class reach their goal.
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">5 days ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Class Achievements */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  Recent Class Achievements
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {achievements && achievements.length > 0 ? (
                    achievements.slice(0, 4).map((achievement) => (
                      <Card key={achievement.id.toString()} className="border-amber-200 bg-amber-50/50">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <p className="font-medium text-amber-900">{achievement.name}</p>
                              <p className="text-sm text-amber-700 mt-1">{achievement.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <>
                      <Card className="border-amber-200 bg-amber-50/50">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">🏆</div>
                            <div className="flex-1">
                              <p className="font-medium text-amber-900">First Goal Reached!</p>
                              <p className="text-sm text-amber-700 mt-1">
                                The class worked together to reach their first savings goal. Amazing teamwork!
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-amber-200 bg-amber-50/50">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">🤝</div>
                            <div className="flex-1">
                              <p className="font-medium text-amber-900">Kindness Champions</p>
                              <p className="text-sm text-amber-700 mt-1">
                                Everyone in the class helped each other this week. What a caring community!
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl">Payment Management</CardTitle>
              <CardDescription>View and manage school expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upcoming Expenses */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Upcoming Expenses</h3>
                <div className="space-y-3">
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="destructive" className="bg-orange-600">
                              <Clock className="w-3 h-3 mr-1" />
                              Due in 3 days
                            </Badge>
                          </div>
                          <p className="font-semibold text-lg">Field Trip Permission & Fee</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Science Museum visit - Transportation and admission included
                          </p>
                          <p className="text-2xl font-bold text-orange-600 mt-2">$25.00</p>
                        </div>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          Pay Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              <Calendar className="w-3 h-3 mr-1" />
                              Due Dec 15
                            </Badge>
                          </div>
                          <p className="font-semibold text-lg">Class Party Contribution</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Optional contribution for end-of-semester celebration
                          </p>
                          <p className="text-2xl font-bold text-blue-600 mt-2">$15.00</p>
                        </div>
                        <Button variant="outline" className="border-blue-600 text-blue-700">
                          Pay Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">School Supplies</p>
                        <p className="text-sm text-muted-foreground">Paid on Nov 15, 2025</p>
                      </div>
                    </div>
                    <p className="font-semibold">$45.00</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">Book Fair</p>
                        <p className="text-sm text-muted-foreground">Paid on Oct 28, 2025</p>
                      </div>
                    </div>
                    <p className="font-semibold">$20.00</p>
                  </div>
                </div>
              </div>

              {/* Secure Payments */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-start gap-4">
                  <Lock className="w-6 h-6 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      Secure Online Payments
                    </h3>
                    <p className="text-purple-700 mb-4">
                      Soon you'll be able to make secure, transparent payments directly through the platform.
                      All transactions will be verified and recorded for complete transparency.
                    </p>
                    <Button disabled variant="outline" className="border-purple-600 text-purple-700">
                      <Lock className="w-4 h-4 mr-2" />
                      Set Up Payment Method (Coming Soon)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl">Forms & Permissions</CardTitle>
              <CardDescription>Review and sign digital forms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Active Forms */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Forms Requiring Action</h3>
                <div className="space-y-3">
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="destructive" className="bg-orange-600">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Signature Required
                            </Badge>
                          </div>
                          <p className="font-semibold text-lg">Field Trip Permission Slip</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Science Museum - December 10, 2025
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">Due: December 3, 2025</p>
                        </div>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          Review & Sign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <p className="font-semibold text-lg">Photo Release Form</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Annual photo consent for school publications
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">Due: December 15, 2025</p>
                        </div>
                        <Button variant="outline" className="border-blue-600 text-blue-700">
                          Review & Sign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Completed Forms */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Completed Forms</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">Emergency Contact Form</p>
                        <p className="text-sm text-muted-foreground">Signed on Nov 20, 2025</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">Medical Information</p>
                        <p className="text-sm text-muted-foreground">Signed on Oct 15, 2025</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </div>

              {/* Digital Signatures Info */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-start gap-4">
                  <Lock className="w-6 h-6 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      Secure Digital Signatures
                    </h3>
                    <p className="text-purple-700 mb-4">
                      All digital signatures are secured with industry-standard encryption,
                      ensuring security, verification, and permanent record-keeping. Your signatures
                      are legally binding and cryptographically secured.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-purple-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Cryptographically verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl">Profile Settings</CardTitle>
              <CardDescription>Manage your account and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Parent Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent-name">Full Name</Label>
                      <Input id="parent-name" defaultValue="Sarah Johnson" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parent-email">Email</Label>
                      <Input id="parent-email" type="email" defaultValue="sarah.johnson@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-phone">Phone Number</Label>
                    <Input id="parent-phone" type="tel" defaultValue="(555) 123-4567" />
                  </div>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Children Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">My Children</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Child
                  </Button>
                </div>
                <div className="space-y-3">
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Emma Johnson</p>
                          <p className="text-sm text-muted-foreground">Grade 4 - Mrs. Smith's Class</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-gray-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Liam Johnson</p>
                          <p className="text-sm text-muted-foreground">Grade 2 - Mr. Davis's Class</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Payment Methods */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Payment Methods</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
                <div className="space-y-3">
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-semibold">Visa •••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">Default</Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Notification Preferences */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Weekly updates and important alerts</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Payment reminders and urgent updates</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Achievement Notifications</p>
                        <p className="text-sm text-muted-foreground">When your child earns recognition</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Form Alerts</p>
                        <p className="text-sm text-muted-foreground">New forms requiring signature</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button className="mt-4">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
