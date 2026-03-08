"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { Loader2, User, Phone, Mail, Building, Briefcase, Calendar, Check, X, MessageSquare, Upload } from "lucide-react";
import toast from "react-hot-toast";

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  budgetRange: string;
  service: string;
  date: string;
  status: "NEW" | "CONFIRMED" | "COMPLETED";
  createdAt: string;
}

interface MilestoneComment {
  text: string;
  by: string;
  at: string;
}

interface Milestone {
  key: "planned" | "in_progress" | "delivered";
  title: string;
  status: "PENDING" | "DONE";
  files: string[];
  comments: MilestoneComment[];
}

export default function AdminClientsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/admin/bookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load clients/bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookingDetails = async (booking: Booking) => {
    setSelectedBooking(booking);
    setIsLoading(true);
    try {
      // First, get all projects/timelines to find the matching one
      const { data } = await api.get("/api/admin/projects");
      const project = data.find((p: any) => p.bookingId === booking._id);
      if (project) {
        setMilestones(project.milestones || []);
      } else {
        setMilestones([]);
      }
    } catch {
      toast.error("Failed to load project timeline details");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (status: "NEW" | "CONFIRMED" | "COMPLETED") => {
    if (!selectedBooking) return;
    setIsUpdating(true);
    try {
      await api.patch(`/api/admin/bookings/${selectedBooking._id}`, { status });
      toast.success(`Booking status changed to ${status}`);
      setSelectedBooking({ ...selectedBooking, status });
      // Update local array to reflect new status without full refetch
      setBookings(bookings.map(b => b._id === selectedBooking._id ? { ...b, status } : b));
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const postComment = async (milestoneKey: string) => {
    if (!selectedBooking || !commentInput.trim()) return;
    setIsUpdating(true);
    try {
      await api.patch(`/api/admin/projects/${selectedBooking._id}/milestones/${milestoneKey}`, {
        comment: commentInput
      });
      toast.success("Comment sent to client");
      setCommentInput("");
      // Refresh the timeline data
      loadBookingDetails(selectedBooking);
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setIsUpdating(false);
    }
  };

  const markMilestoneDone = async (milestoneKey: string, currentStatus: string) => {
    if (!selectedBooking) return;
    const newStatus = currentStatus === "PENDING" ? "DONE" : "PENDING";
    setIsUpdating(true);
    try {
      await api.patch(`/api/admin/projects/${selectedBooking._id}/milestones/${milestoneKey}`, {
        status: newStatus
      });
      toast.success(`Milestone marked as ${newStatus}`);
      loadBookingDetails(selectedBooking);
    } catch {
      toast.error("Failed to update milestone");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading && bookings.length === 0) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--muted)]" /></div>;
  }

  // Active view: list or detail
  if (selectedBooking) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between border-b border-black/10 pb-4">
          <div>
            <button onClick={() => setSelectedBooking(null)} className="text-sm text-[var(--muted)] hover:text-black mb-2 flex items-center gap-1">
              &larr; Back to Client List
            </button>
            <h1 className="text-3xl font-display text-[var(--ink)]">{selectedBooking.name}</h1>
            <p className="text-sm text-[var(--muted)]">{selectedBooking.businessType} - Requested {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            {selectedBooking.status === "NEW" && (
              <>
                <button onClick={() => updateStatus("CONFIRMED")} disabled={isUpdating} className="px-4 py-2 bg-[var(--ink)] text-white text-sm font-medium rounded-lg hover:bg-black/80 transition flex items-center gap-2">
                  <Check size={16} /> Accept Booking
                </button>
                <button onClick={() => updateStatus("COMPLETED")} disabled={isUpdating} className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition flex items-center gap-2">
                  <X size={16} /> Reject/Close
                </button>
              </>
            )}
            {selectedBooking.status === "CONFIRMED" && (
              <button onClick={() => updateStatus("COMPLETED")} disabled={isUpdating} className="px-4 py-2 border border-green-200 text-green-700 bg-green-50 text-sm font-medium rounded-lg transition flex items-center gap-2">
                <Check size={16} /> Mark Project Delivered
              </button>
            )}
            {selectedBooking.status === "COMPLETED" && (
              <span className="px-4 py-2 bg-gray-100 text-[var(--muted)] text-sm font-medium rounded-lg">Closed</span>
            )}
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Client Details Sidebar */}
          <div className="soft-card p-6 h-fit space-y-4">
            <h3 className="font-semibold text-[var(--ink)] uppercase tracking-wider text-xs border-b pb-2 mb-4">Request Profile</h3>
            <div className="flex items-center gap-3 text-sm"><User size={16} className="text-[var(--muted)]" /> {selectedBooking.name}</div>
            <div className="flex items-center gap-3 text-sm"><Mail size={16} className="text-[var(--muted)]" /> <a href={`mailto:${selectedBooking.email}`} className="text-blue-600 hover:underline">{selectedBooking.email}</a></div>
            <div className="flex items-center gap-3 text-sm"><Phone size={16} className="text-[var(--muted)]" /> {selectedBooking.phone}</div>
            <div className="flex items-center gap-3 text-sm"><Building size={16} className="text-[var(--muted)]" /> {selectedBooking.businessType}</div>
            <div className="flex items-center gap-3 text-sm"><Briefcase size={16} className="text-[var(--muted)]" /> <b>{selectedBooking.service}</b></div>
            <div className="flex items-center gap-3 text-sm"><Calendar size={16} className="text-[var(--muted)]" /> Goal: {new Date(selectedBooking.date).toLocaleDateString()}</div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-[var(--muted)] uppercase">Client Workflow/Bottlenecks</p>
              <p className="text-sm mt-1 bg-gray-50 p-3 rounded border italic">"{selectedBooking.currentWorkflow || "No detail provided"}"</p>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-[var(--muted)] uppercase">Budget Range</p>
              <p className="font-medium mt-1">{selectedBooking.budgetRange || "Not specified"}</p>
            </div>
          </div>

          {/* 2-Way Communication / Timeline Engine */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-display text-[var(--ink)] border-b pb-2">Client Pipeline & Feedback</h2>
            
            {milestones.length === 0 ? (
              <div className="p-8 text-center text-[var(--muted)] border border-dashed rounded-lg">
                <p>No timeline instantiated yet. Accept the booking to initialize the pipeline.</p>
              </div>
            ) : (
              milestones.map((m) => (
                <div key={m.key} className="soft-card p-6 relative overflow-hidden">
                  {/* Status Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${m.status === 'DONE' ? 'bg-green-500' : 'bg-orange-400'}`} />
                  
                  <div className="flex justify-between items-start mb-4 pl-2">
                    <div>
                      <h3 className="font-semibold text-lg">{m.title}</h3>
                      <button 
                        onClick={() => markMilestoneDone(m.key, m.status)}
                        className={`text-xs mt-1 ${m.status === 'DONE' ? 'text-green-600' : 'text-orange-500 hover:underline'}`}
                      >
                        Status: {m.status} (Click to toggle)
                      </button>
                    </div>
                  </div>

                  {/* Comment Thread */}
                  <div className="space-y-3 pl-2 max-h-60 overflow-y-auto mb-4 bg-gray-50/50 p-4 rounded border">
                    {m.comments.length === 0 && <p className="text-xs text-[var(--muted)] italic">No instructions or messages yet</p>}
                    {m.comments.map((c, i) => (
                      <div key={i} className={`text-sm p-3 rounded-lg ${c.by === 'admin' ? 'bg-[var(--ink)] text-white ml-8' : 'bg-white border mr-8'}`}>
                        <div className="flex justify-between text-[10px] uppercase opacity-70 mb-1">
                          <span>{c.by === 'admin' ? 'You (Admin)' : 'Client'}</span>
                          <span>{new Date(c.at).toLocaleString()}</span>
                        </div>
                        <p>{c.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="flex gap-2 pl-2 mt-2">
                    <input 
                      type="text" 
                      placeholder={`Send instruction or update to client regarding ${m.title}...`}
                      className="flex-1 text-sm px-3 py-2 border rounded-md focus:outline-none focus:border-[var(--ink)]"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') postComment(m.key);
                      }}
                    />
                    <button 
                      onClick={() => postComment(m.key)}
                      disabled={!commentInput.trim() || isUpdating}
                      className="px-4 bg-[var(--ink)] text-white rounded-md hover:bg-black/80 transition disabled:opacity-50 text-sm flex items-center justify-center"
                    >
                      <MessageSquare size={14} />
                    </button>
                  </div>
                  
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display text-[var(--ink)]">Client Requests</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Accept incoming service inquiries and engage in 2-way project tracking.</p>
        </div>
      </header>
      
      <div className="soft-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/5 border-b border-black/10">
            <tr>
              <th className="px-6 py-4 font-semibold text-[var(--ink)]">Client</th>
              <th className="px-6 py-4 font-semibold text-[var(--ink)]">Service Requested</th>
              <th className="px-6 py-4 font-semibold text-[var(--ink)]">Target Date</th>
              <th className="px-6 py-4 font-semibold text-[var(--ink)]">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {bookings.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-[var(--muted)]">No pending client requests found.</td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="hover:bg-black/5 transition group cursor-pointer" onClick={() => loadBookingDetails(b)}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[var(--ink)]">{b.name}</div>
                    <div className="text-[var(--muted)] text-xs mt-0.5">{b.businessType}</div>
                  </td>
                  <td className="px-6 py-4">{b.service}</td>
                  <td className="px-6 py-4">{new Date(b.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full 
                      ${b.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 
                        b.status === 'CONFIRMED' ? 'bg-orange-100 text-orange-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[var(--ink)] text-sm font-medium opacity-0 group-hover:opacity-100 transition underline">
                      Manage Pipeline &rarr;
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
