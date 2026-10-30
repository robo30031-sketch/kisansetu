import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  RotateCcw,
  X,
  FileText,
  BookmarkCheck,
  Check,
} from 'lucide-react';
import { FarmTask, Farm, CropCycle, TaskStatus } from '../../types';
import { TranslationType } from '../../locales';
import { SectionGuide } from '../../components/SectionGuide';
import { ConfirmDialog, FormField, EmptyState, StatusBadge } from '../../components/CommonUI';

interface TasksViewProps {
  tasks: FarmTask[];
  farms: Farm[];
  crops: CropCycle[];
  t: TranslationType;
  langCode: string;
  onSaveTask: (task: Partial<FarmTask>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onToggleComplete: (taskId: string, isDone: boolean) => Promise<void>;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  farms,
  crops,
  t,
  langCode,
  onSaveTask,
  onDeleteTask,
  onToggleComplete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<FarmTask | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [farmFilter, setFarmFilter] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [cropCycleId, setCropCycleId] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const suggestedTemplates = [
    { title: t.tasks.tplIrrigate, notes: 'Inspect tube-well lines and check water levels in plots.' },
    { title: t.tasks.tplBuySupplies, notes: 'Procure fertilizer or seed bags from cooperative society.' },
    { title: t.tasks.tplSpray, notes: 'Scout boundary plots for weeds or aphid infestations.' },
    { title: t.tasks.tplHarvest, notes: 'Organize harvest sickle labour, thresher, and gunny bags.' },
    { title: t.tasks.tplMandi, notes: 'Book tractor trolley for transportation to Mandi yard.' },
  ];

  const openNewModal = (templateTitle?: string, templateNotes?: string) => {
    setEditingTask(null);
    setTitle(templateTitle || '');
    setNotes(templateNotes || '');
    setDueDate(todayStr);
    setFarmId(farms[0]?.id || '');
    setCropCycleId('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: FarmTask) => {
    setEditingTask(task);
    setTitle(task.title);
    setDueDate(task.due_date || '');
    setFarmId(task.farm_id);
    setCropCycleId(task.crop_cycle_id || '');
    setNotes(task.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) {
      setFormError('Please select a farm.');
      return;
    }
    if (!title.trim()) {
      setFormError('Task title is required.');
      return;
    }

    try {
      await onSaveTask({
        id: editingTask ? editingTask.id : undefined,
        farm_id: farmId,
        crop_cycle_id: cropCycleId || null,
        title: title.trim(),
        due_date: dueDate || null,
        notes: notes.trim() || null,
        status: editingTask ? editingTask.status : 'pending',
      });
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Error saving task');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (farmFilter !== 'all' && t.farm_id !== farmFilter) return false;
    return true;
  });

  const farmMap: Record<string, string> = {};
  farms.forEach((f) => (farmMap[f.id] = f.name));

  const cropMap: Record<string, string> = {};
  crops.forEach((c) => (cropMap[c.id] = c.crop_name));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3027]">{t.tasks.title}</h1>
          <p className="text-sm text-[#65746A]">
            Remember your irrigation timings, weed inspections, and harvest preparations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openNewModal()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#176B43] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#104C2F]"
        >
          <Plus className="w-4 h-4" />
          <span>{t.tasks.addNewTask}</span>
        </button>
      </div>

      {/* Guide */}
      <SectionGuide
        title={t.guide.title}
        langCode={langCode}
        instructions={[
          "Add personal farming to-dos with due dates to keep your field work on schedule.",
          "Tap on any suggested template below to quickly create tasks for irrigation, spraying, or mandi transport.",
          "Once completed, click 'Mark Done' to record completion without deleting your historical log.",
        ]}
      />

      {/* Suggested Quick Templates */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-[#F7F8F0] p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#176B43] mb-2.5 flex items-center gap-1.5">
          <BookmarkCheck className="w-4 h-4" />
          <span>{t.tasks.templates}</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {suggestedTemplates.map((tpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => openNewModal(tpl.title, tpl.notes)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#D3E6DC] text-xs font-semibold text-[#1D3027] hover:border-[#176B43] hover:text-[#176B43] transition-colors"
            >
              + {tpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-3.5 shadow-2xs flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-[#65746A]">Filter Tasks:</span>

        <div className="inline-flex rounded-xl border border-[#D3E6DC] p-1 bg-[#F7F8F0]">
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'pending'
                ? 'bg-[#176B43] text-white shadow-xs'
                : 'text-[#65746A] hover:text-[#1D3027]'
            }`}
          >
            {t.tasks.statusPending}
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'completed'
                ? 'bg-[#176B43] text-white shadow-xs'
                : 'text-[#65746A] hover:text-[#1D3027]'
            }`}
          >
            {t.tasks.statusCompleted}
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#176B43] text-white shadow-xs'
                : 'text-[#65746A] hover:text-[#1D3027]'
            }`}
          >
            {t.common.all}
          </button>
        </div>

        <select
          value={farmFilter}
          onChange={(e) => setFarmFilter(e.target.value)}
          className="rounded-xl border border-[#D3E6DC] px-3 py-1.5 text-xs text-[#1D3027] bg-[#F7F8F0]"
        >
          <option value="all">All Farms</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title={t.tasks.noTasks}
          description="Create your first farming task to organize your weekly field routine."
          actionText={t.tasks.addNewTask}
          onAction={() => openNewModal()}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isOverdue =
              !isCompleted && task.due_date && task.due_date < todayStr;
            const isToday =
              !isCompleted && task.due_date && task.due_date === todayStr;

            const farmName = farmMap[task.farm_id] || 'Farm';
            const cropName = task.crop_cycle_id ? cropMap[task.crop_cycle_id] : null;

            return (
              <div
                key={task.id}
                className={`rounded-2xl border p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'border-[#D3E6DC] bg-white/70 opacity-80'
                    : isOverdue
                    ? 'border-[#F8B4B4] bg-[#FDF2F2]'
                    : isToday
                    ? 'border-[#FBD87F] bg-[#FEF7E6]'
                    : 'border-[#D3E6DC] bg-white'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    type="button"
                    onClick={() => onToggleComplete(task.id, !isCompleted)}
                    className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-[#176B43] border-[#176B43] text-white'
                        : 'border-[#D3E6DC] bg-white text-transparent hover:border-[#176B43]'
                    }`}
                    title={isCompleted ? 'Mark incomplete' : 'Mark done'}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          isCompleted
                            ? 'line-through text-[#65746A]'
                            : isOverdue
                            ? 'text-[#B83B35]'
                            : 'text-[#1D3027]'
                        }`}
                      >
                        {task.title}
                      </h3>
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B83B35] text-white">
                          <AlertTriangle className="w-3 h-3" />
                          Overdue
                        </span>
                      )}
                      {isToday && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C88716] text-white">
                          Due Today
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#65746A]">
                      <span>{farmName}</span>
                      {cropName && <span className="text-[#3F8F52]">🌱 {cropName}</span>}
                      {task.due_date && (
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#65746A]" />
                          {task.due_date}
                        </span>
                      )}
                    </div>

                    {task.notes && (
                      <p className="text-xs text-[#65746A] pt-1 italic">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => openEditModal(task)}
                    className="p-1.5 text-[#65746A] hover:text-[#176B43] rounded-lg hover:bg-[#F7F8F0]"
                    title="Edit task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(task.id)}
                    className="p-1.5 text-[#65746A] hover:text-[#B83B35] rounded-lg hover:bg-[#FDF2F2]"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT TASK MODAL */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#D3E6DC] my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3E6DC]">
              <h2 className="text-base font-bold text-[#1D3027]">
                {editingTask ? t.tasks.editTask : t.tasks.addNewTask}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#65746A] hover:bg-[#F7F8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-xs font-semibold text-[#B83B35]">
                  {formError}
                </div>
              )}

              <FormField label={t.tasks.taskTitle} required>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect boundary drip pipe / Apply Urea"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label={t.tasks.dueDate}>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </FormField>

                <FormField label="Farm" required>
                  <select
                    value={farmId}
                    onChange={(e) => setFarmId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Linked Crop Cycle (Optional)">
                <select
                  value={cropCycleId}
                  onChange={(e) => setCropCycleId(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                >
                  <option value="">General Farm Task (No specific crop)</option>
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.crop_name} ({c.season || 'All'})
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label={t.common.notes}>
                <textarea
                  rows={2}
                  placeholder="Notes, worker names, reminders..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D3E6DC] text-xs font-semibold text-[#65746A] hover:bg-[#F7F8F0]"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#176B43] text-xs font-bold text-white shadow-xs hover:bg-[#104C2F]"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Farming Task"
        message="Are you sure you want to delete this scheduled task?"
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        isDestructive
        onConfirm={async () => {
          if (deleteTargetId) {
            await onDeleteTask(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
