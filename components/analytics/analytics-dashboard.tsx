"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Target,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
} from "lucide-react"
import { useState } from "react"

const analyticsData = {
  overview: {
    totalViews: 12847,
    totalSubmissions: 3247,
    conversionRate: 25.3,
    averageTime: 142,
    bounceRate: 34.2,
    completionRate: 78.9,
  },
  trends: {
    views: { current: 12847, previous: 11234, change: 14.4 },
    submissions: { current: 3247, previous: 2891, change: 12.3 },
    conversion: { current: 25.3, previous: 23.1, change: 9.5 },
  },
  devices: [
    { type: "Desktop", count: 7234, percentage: 56.3, icon: Monitor },
    { type: "Mobile", count: 4521, percentage: 35.2, icon: Smartphone },
    { type: "Tablet", count: 1092, percentage: 8.5, icon: Tablet },
  ],
  topSources: [
    { source: "Direct", count: 4521, percentage: 35.2 },
    { source: "Google Search", count: 3847, percentage: 29.9 },
    { source: "Social Media", count: 2234, percentage: 17.4 },
    { source: "Email Campaign", count: 1456, percentage: 11.3 },
    { source: "Referral", count: 789, percentage: 6.2 },
  ],
  locations: [
    { country: "United States", count: 5234, percentage: 40.7 },
    { country: "United Kingdom", count: 2134, percentage: 16.6 },
    { country: "Canada", count: 1567, percentage: 12.2 },
    { country: "Australia", count: 1234, percentage: 9.6 },
    { country: "Germany", count: 987, percentage: 7.7 },
  ],
}

export function AnalyticsDashboard({ formId }: { formId: string }) {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("views")

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Detailed insights for your form performance</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card variant="elevated" className="hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatNumber(analyticsData.overview.totalViews)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">+{analyticsData.trends.views.change}%</span>
                  <span className="text-sm text-gray-500 ml-2">vs last period</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-100">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Submissions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatNumber(analyticsData.overview.totalSubmissions)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    +{analyticsData.trends.submissions.change}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs last period</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-green-100">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analyticsData.overview.conversionRate}%</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">+{analyticsData.trends.conversion.change}%</span>
                  <span className="text-sm text-gray-500 ml-2">vs last period</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-purple-100">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatTime(analyticsData.overview.averageTime)}
                </p>
                <p className="text-sm text-gray-500 mt-2">Time to complete</p>
              </div>
              <div className="p-3 rounded-2xl bg-orange-100">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analyticsData.overview.completionRate}%</p>
                <p className="text-sm text-gray-500 mt-2">Users who finished</p>
              </div>
              <div className="p-3 rounded-2xl bg-green-100">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analyticsData.overview.bounceRate}%</p>
                <p className="text-sm text-gray-500 mt-2">Left without submitting</p>
              </div>
              <div className="p-3 rounded-2xl bg-red-100">
                <ArrowDown className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-xl">Device Breakdown</CardTitle>
            <p className="text-sm text-gray-600">How users access your form</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.devices.map((device) => (
                <div
                  key={device.type}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-white">
                      <device.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{device.type}</p>
                      <p className="text-sm text-gray-500">{formatNumber(device.count)} users</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{device.percentage}%</p>
                    <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full gradient-primary rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-xl">Traffic Sources</CardTitle>
            <p className="text-sm text-gray-600">Where your visitors come from</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topSources.map((source, index) => (
                <div
                  key={source.source}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{source.source}</p>
                      <p className="text-sm text-gray-500">{formatNumber(source.count)} visits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{source.percentage}%</p>
                    <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full gradient-secondary rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Data */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Geographic Distribution
          </CardTitle>
          <p className="text-sm text-gray-600">Top countries by submissions</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {analyticsData.locations.map((location, index) => (
              <div
                key={location.country}
                className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">#{index + 1}</span>
                  <Badge variant="secondary" size="sm">
                    {location.percentage}%
                  </Badge>
                </div>
                <p className="font-semibold text-gray-900 mb-1">{location.country}</p>
                <p className="text-sm text-gray-500">{formatNumber(location.count)} submissions</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div className="h-full gradient-success rounded-full" style={{ width: `${location.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
