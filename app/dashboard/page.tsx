"use client"

import { cn } from "@/lib/utils"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Users,
  Workflow,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Clock,
  Zap,
  Target,
  Globe,
  Download,
  Filter,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchForms, deleteForm, duplicateForm } from "@/lib/features/forms/formsSlice"
import { format } from "date-fns"

const stats = [
  {
    title: "Total Forms",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    description: "Active forms",
  },
  {
    title: "Total Submissions",
    value: "3,247",
    change: "+23%",
    trend: "up",
    icon: Users,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    description: "This month",
  },
  {
    title: "Conversion Rate",
    value: "68.4%",
    change: "+5.2%",
    trend: "up",
    icon: Target,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    description: "Average rate",
  },
  {
    title: "Active Workflows",
    value: "12",
    change: "+3",
    trend: "up",
    icon: Workflow,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    description: "Automated",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "submission",
    title: "New submission received",
    description: "Customer Feedback Survey",
    time: "2 minutes ago",
    icon: Users,
    color: "text-green-600 dark:text-green-400",
  },
  {
    id: 2,
    type: "form",
    title: "Form published",
    description: "Product Registration Form",
    time: "1 hour ago",
    icon: Globe,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    id: 3,
    type: "workflow",
    title: "Workflow triggered",
    description: "Low rating alert sent",
    time: "3 hours ago",
    icon: Zap,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    id: 4,
    type: "form",
    title: "Form created",
    description: "Event Registration",
    time: "1 day ago",
    icon: FileText,
    color: "text-purple-600 dark:text-purple-400",
  },
]

const topForms = [
  {
    id: "1",
    name: "Customer Feedback Survey",
    submissions: 847,
    conversionRate: 72.3,
    status: "published",
    trend: "up",
  },
  {
    id: "2",
    name: "Product Registration",
    submissions: 623,
    conversionRate: 68.9,
    status: "published",
    trend: "up",
  },
  {
    id: "3",
    name: "Newsletter Signup",
    submissions: 1205,
    conversionRate: 45.2,
    status: "published",
    trend: "down",
  },
  {
    id: "4",
    name: "Contact Form",
    submissions: 389,
    conversionRate: 81.7,
    status: "published",
    trend: "up",
  },
]

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const { forms, loading } = useAppSelector((state) => state.forms)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    dispatch(fetchForms())
  }, [dispatch])

  const handleDeleteForm = (id: string) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      dispatch(deleteForm(id))
    }
  }

  const handleDuplicateForm = (id: string) => {
    dispatch(duplicateForm(id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "draft":
        return "secondary"
      case "archived":
        return "secondary"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-2xl shimmer" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-muted rounded-2xl shimmer" />
            <div className="h-96 bg-muted rounded-2xl shimmer" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your forms.</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Last 7 days
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange("1d")}>Last 24 hours</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("7d")}>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("30d")}>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("90d")}>Last 90 days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/forms/create">
            <Button variant="gradient" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Form
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} variant="elevated" className="hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                  <div className="flex items-center space-x-2">
                    <div
                      className={cn(
                        "flex items-center text-sm font-medium",
                        stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                      )}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUp className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                    <span className="text-xs text-muted-foreground">{stat.description}</span>
                  </div>
                </div>
                <div className={cn("p-4 rounded-2xl", stat.bgColor)}>
                  <stat.icon className={cn("w-8 h-8", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Forms */}
        <div className="lg:col-span-2">
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Forms</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Your latest form activity</p>
              </div>
              <Link href="/forms">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forms.slice(0, 5).map((form) => (
                  <div
                    key={form.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{form.name}</p>
                        <p className="text-sm text-muted-foreground">{form.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(form.createdAt), "MMM dd, yyyy")}
                          </span>
                          <Badge variant={getStatusColor(form.status)} size="sm">
                            {form.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <p className="text-lg font-bold text-foreground">{form.submissions}</p>
                        <p className="text-xs text-muted-foreground">submissions</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/forms/${form.id}/preview`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/forms/builder/${form.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateForm(form.id)}>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteForm(form.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground">Latest updates and notifications</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-xl hover:bg-accent transition-colors duration-200"
                  >
                    <div
                      className={cn(
                        "p-2 rounded-xl",
                        activity.type === "submission"
                          ? "bg-green-100 dark:bg-green-900/20"
                          : activity.type === "form"
                            ? "bg-blue-100 dark:bg-blue-900/20"
                            : activity.type === "workflow"
                              ? "bg-yellow-100 dark:bg-yellow-900/20"
                              : "bg-purple-100 dark:bg-purple-900/20",
                      )}
                    >
                      <activity.icon className={cn("w-4 h-4", activity.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                      <div className="flex items-center mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Forms */}
          <Card variant="elevated" className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Top Performing</CardTitle>
              <p className="text-sm text-muted-foreground">Best conversion rates</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topForms.map((form, index) => (
                  <div key={form.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-32">{form.name}</p>
                        <p className="text-xs text-muted-foreground">{form.submissions} submissions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{form.conversionRate}%</p>
                        <div className="flex items-center">
                          {form.trend === "up" ? (
                            <ArrowUp className="w-3 h-3 text-green-500 dark:text-green-400" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-red-500 dark:text-red-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
