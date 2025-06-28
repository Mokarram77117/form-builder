"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectItem } from "@/components/ui/select"
import { Search, Download, Trash2, Eye, Calendar, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchSubmissions, deleteSubmission, setSelectedFormId } from "@/lib/features/submissions/submissionsSlice"
import { fetchForms } from "@/lib/features/forms/formsSlice"
import { format } from "date-fns"

export default function SubmissionsPage() {
  const dispatch = useAppDispatch()
  const { submissions, loading, selectedFormId } = useAppSelector((state) => state.submissions)
  const { forms } = useAppSelector((state) => state.forms)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchForms())
    dispatch(fetchSubmissions())
  }, [dispatch])

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = Object.values(submission.data).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase()),
    )
    const matchesForm = !selectedFormId || submission.formId === selectedFormId
    return matchesSearch && matchesForm
  })

  const handleDeleteSubmission = (id: string) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      dispatch(deleteSubmission(id))
    }
  }

  const handleExportSubmissions = () => {
    // Export functionality would be implemented here
    console.log("Exporting submissions...")
  }

  const getFormName = (formId: string) => {
    const form = forms.find((f) => f.id === formId)
    return form?.name || "Unknown Form"
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
          <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
          <p className="text-gray-600">View and manage form submissions</p>
        </div>
        <Button onClick={handleExportSubmissions} className="mt-4 sm:mt-0">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedFormId || "all"}
              onValueChange={(value) => dispatch(setSelectedFormId(value === "all" ? null : value))}
            >
              <SelectItem value="all">All Forms</SelectItem>
              {forms.map((form) => (
                <SelectItem key={form.id} value={form.id}>
                  {form.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Submissions ({filteredSubmissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                  <p className="text-gray-600">
                    {searchQuery ? "Try adjusting your search terms" : "No submissions have been received yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedSubmission?.id === submission.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary">{getFormName(submission.formId)}</Badge>
                            <span className="text-xs text-gray-500">
                              {format(new Date(submission.submittedAt), "MMM dd, yyyy 'at' HH:mm")}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            {Object.entries(submission.data)
                              .slice(0, 4)
                              .map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium text-gray-600">{key}:</span>{" "}
                                  <span className="text-gray-900">{String(value)}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedSubmission(submission)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteSubmission(submission.id)
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submission Details */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSubmission ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Form Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{getFormName(selectedSubmission.formId)}</Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(selectedSubmission.submittedAt), "MMM dd, yyyy 'at' HH:mm")}</span>
                      </div>
                      {selectedSubmission.ipAddress && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <span>IP: {selectedSubmission.ipAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Submitted Data</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedSubmission.data).map(([key, value]) => (
                        <div key={key} className="border-b border-gray-100 pb-2">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{key}</p>
                          <p className="text-sm text-gray-900 mt-1">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a submission to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
