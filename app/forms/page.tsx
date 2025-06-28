"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Eye, Edit, Trash2, MoreVertical, Copy, Archive, Play, Pause } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  fetchForms,
  deleteForm,
  duplicateForm,
  setSearchQuery,
  setFilterStatus,
  updateFormStatus,
} from "@/lib/features/forms/formsSlice"
import { format } from "date-fns"

export default function FormsPage() {
  const dispatch = useAppDispatch()
  const { forms, loading, searchQuery, filterStatus } = useAppSelector((state) => state.forms)

  useEffect(() => {
    dispatch(fetchForms())
  }, [dispatch])

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || form.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleDeleteForm = (id: string) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      dispatch(deleteForm(id))
    }
  }

  const handleDuplicateForm = (id: string) => {
    dispatch(duplicateForm(id))
  }

  const handleStatusChange = (id: string, status: "draft" | "published" | "archived") => {
    dispatch(updateFormStatus({ id, status }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4" />
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-600">Create and manage your forms</p>
        </div>
        <Link href="/forms/builder/new">
          <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-200 hover:border-purple-500 bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter:{" "}
                  {filterStatus === "all" ? "All" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => dispatch(setFilterStatus("all"))}>All Forms</DropdownMenuItem>
                <DropdownMenuItem onClick={() => dispatch(setFilterStatus("published"))}>Published</DropdownMenuItem>
                <DropdownMenuItem onClick={() => dispatch(setFilterStatus("draft"))}>Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => dispatch(setFilterStatus("archived"))}>Archived</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Forms Table */}
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Forms ({filteredForms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first form"}
              </p>
              <Link href="/forms/builder/new">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Form
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Form Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Created At</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Submissions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForms.map((form) => (
                    <tr key={form.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{form.name}</p>
                          <p className="text-sm text-gray-500">{form.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {format(new Date(form.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {form.submissions}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${getStatusColor(form.status)} border`}>
                          {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/forms/${form.id}/preview`}>
                            <Button variant="ghost" size="sm" className="hover:bg-purple-50 hover:text-purple-600">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/forms/builder/${form.id}`}>
                            <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleDuplicateForm(form.id)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              {form.status === "published" ? (
                                <DropdownMenuItem onClick={() => handleStatusChange(form.id, "draft")}>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Unpublish
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(form.id, "published")}>
                                  <Play className="w-4 h-4 mr-2" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleStatusChange(form.id, "archived")}>
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteForm(form.id)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
