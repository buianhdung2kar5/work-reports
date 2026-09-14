/**
 * Supabase Integration & Data Layer for Báo Cáo Tiến Độ Tập Văn Nghệ Sinh Viên
 * Tự động nạp thông số từ .env hoặc window.ENV_*
 */

(function (window) {
  'use strict';

  let supabaseClient = null;

  function initClient() {
    if (supabaseClient) return supabaseClient;

    let rawUrl = window.ENV_SUPABASE_URL || 'https://ftyqwpzekrxhzolbjrbq.supabase.co';
    const rawKey = window.ENV_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0eXF3cHpla3J4aHpvbGJqcmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNTcxMDAsImV4cCI6MjEwNDkzMzEwMH0.JvolK_uEa7qFsRSPyJdJv7MX4qmIu_XDrMYhGlYu_2Y';

    if (rawUrl.includes('/dashboard/project/')) {
      const projId = rawUrl.split('/dashboard/project/')[1].split('/')[0].split('?')[0];
      rawUrl = `https://${projId}.supabase.co`;
    }

    const SUPABASE_URL = rawUrl;
    const SUPABASE_ANON_KEY = rawKey;

    if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('⚡ Supabase Client initialized successfully with URL:', SUPABASE_URL);
      } catch (err) {
        console.warn('⚠️ Supabase init error:', err);
      }
    }
    return supabaseClient;
  }

  // Attempt initial setup
  initClient();

  const SupabaseStore = {
    isConfigured: function () {
      return initClient() !== null;
    },

    // 1. Load data from Supabase or Fallback LocalStorage
    loadAllData: async function (fallbackData) {
      if (window.envLoadingPromise) {
        try { await window.envLoadingPromise; } catch (e) { /* ignore */ }
      }

      const client = initClient();
      if (!client) return false;

      try {
        // Load Overview
        try {
          const { data: overviewData, error: ovErr } = await client.from('overview').select('*').limit(1);
          if (!ovErr && overviewData && overviewData.length > 0) {
            const ov = overviewData[0];
            fallbackData.overview = {
              showName: ov.show_name || fallbackData.overview.showName,
              className: ov.class_name || fallbackData.overview.className,
              teachers: ov.teachers || fallbackData.overview.teachers,
              totalMembers: ov.total_members || 35,
              performanceDate: ov.performance_date || fallbackData.overview.performanceDate,
              generalGoal: ov.general_goal || fallbackData.overview.generalGoal,
              completionCriteria: ov.completion_criteria || fallbackData.overview.completionCriteria,
              overallStatus: ov.overall_status || fallbackData.overview.overallStatus
            };
          }
        } catch (ovE) {
          console.warn('Overview fetch warning:', ovE);
        }

        // Load Priorities (optional table)
        try {
          const { data: prioritiesData, error: prErr } = await client.from('priorities').select('*').order('created_at', { ascending: true });
          if (!prErr && prioritiesData && prioritiesData.length > 0) {
            fallbackData.priorities = prioritiesData.map(p => ({
              id: p.id,
              task: p.task,
              author: p.author,
              date: p.date
            }));
          }
        } catch (prE) {
          console.warn('Priorities fetch warning:', prE);
        }

        // Load Weekly Goals
        try {
          const { data: weeklyData, error: wkErr } = await client.from('weekly_goals').select('*').order('sort_order', { ascending: true });
          if (!wkErr && weeklyData && weeklyData.length > 0) {
            fallbackData.weeklyGoals = weeklyData.map(w => ({
              id: w.id,
              weekLabel: w.week_label,
              timeframe: w.timeframe,
              goal: w.goal,
              content: w.content,
              targetGroup: w.target_group,
              criteria: w.criteria,
              progress: w.progress,
              status: w.status,
              notes: w.notes
            }));
          }
        } catch (wkE) {
          console.warn('Weekly goals fetch warning:', wkE);
        }

        // Load Practice Logs
        try {
          const { data: logsData, error: logErr } = await client.from('practice_logs').select('*').order('session_num', { ascending: true });
          if (!logErr && logsData && logsData.length > 0) {
            fallbackData.logs = logsData.map(l => ({
              id: l.id,
              date: l.date,
              sessionNum: l.session_num,
              content: l.content,
              attendance: l.attendance,
              result: l.result,
              progress: l.progress,
              issues: l.issues,
              supportNeeded: l.support_needed,
              nextTasks: l.next_tasks,
              author: l.author
            }));
          }
        } catch (logE) {
          console.warn('Practice logs fetch warning:', logE);
        }

        // Load Focused Notes
        try {
          const { data: notesData, error: ntErr } = await client.from('focused_notes').select('*').order('sort_order', { ascending: true });
          if (!ntErr && notesData && notesData.length > 0) {
            const formattedNotes = { music: [], formation: [], costumes: [], schedule: [], health: [] };
            notesData.forEach(n => {
              if (formattedNotes[n.category]) {
                formattedNotes[n.category].push({ id: n.id, text: n.item_text, checked: n.is_checked });
              }
            });
            fallbackData.notes = formattedNotes;
          }
        } catch (ntE) {
          console.warn('Focused notes fetch warning:', ntE);
        }

        console.log('✅ Synchronized data with Supabase Cloud!');
        return true;
      } catch (err) {
        console.warn('⚠️ Error loading data from Supabase:', err.message || err);
        return false;
      }
    },

    // 2. Save Overview CMS Settings
    saveOverview: async function (ovObj) {
      const client = initClient();
      if (!client) return;
      try {
        const { data } = await client.from('overview').select('id').limit(1);
        const overviewId = (data && data.length > 0) ? data[0].id : undefined;

        const payloadFull = {
          ...(overviewId ? { id: overviewId } : {}),
          show_name: ovObj.showName,
          class_name: ovObj.className,
          teachers: ovObj.teachers,
          total_members: ovObj.totalMembers || 35,
          performance_date: ovObj.performanceDate,
          general_goal: ovObj.generalGoal,
          completion_criteria: ovObj.completionCriteria,
          overall_status: ovObj.overallStatus
        };

        const { error } = await client.from('overview').upsert(payloadFull, { onConflict: 'id' });
        if (error && error.code === 'PGRST204') {
          // Fallback if total_members column is not yet in remote DB schema
          delete payloadFull.total_members;
          await client.from('overview').upsert(payloadFull, { onConflict: 'id' });
        }
        console.log('✅ Overview saved to Supabase');
      } catch (e) {
        console.error('Error saving overview to Supabase:', e);
      }
    },

    // 3. Save Priority Item
    savePriority: async function (pItem) {
      const client = initClient();
      if (!client) return;
      try {
        const { error } = await client.from('priorities').upsert({
          id: pItem.id,
          task: pItem.task,
          author: pItem.author,
          date: pItem.date
        }, { onConflict: 'id' });
        if (error && error.code === 'PGRST205') {
          console.warn('Priorities table not created yet in Supabase.');
        } else {
          console.log('✅ Priority saved to Supabase');
        }
      } catch (e) {
        console.error('Error saving priority to Supabase:', e);
      }
    },

    // Delete Priority Item
    deletePriority: async function (pId) {
      const client = initClient();
      if (!client) return;
      try {
        const { error } = await client.from('priorities').delete().eq('id', pId);
        if (error && error.code === 'PGRST205') {
          console.warn('Priorities table not created yet in Supabase.');
        } else {
          console.log('✅ Priority deleted from Supabase');
        }
      } catch (e) {
        console.error('Error deleting priority from Supabase:', e);
      }
    },

    // 4. Save Weekly Goal
    saveWeeklyGoal: async function (weekObj) {
      const client = initClient();
      if (!client) return;
      try {
        await client.from('weekly_goals').upsert({
          id: weekObj.id,
          week_label: weekObj.weekLabel,
          timeframe: weekObj.timeframe,
          goal: weekObj.goal,
          content: weekObj.content,
          target_group: weekObj.targetGroup,
          criteria: weekObj.criteria,
          progress: weekObj.progress,
          status: weekObj.status,
          notes: weekObj.notes
        }, { onConflict: 'id' });
        console.log('✅ Weekly goal saved to Supabase');
      } catch (e) {
        console.error('Error saving weekly goal to Supabase:', e);
      }
    },

    // Delete Weekly Goal
    deleteWeeklyGoal: async function (weekId) {
      const client = initClient();
      if (!client) return;
      try {
        await client.from('weekly_goals').delete().eq('id', weekId);
        console.log('✅ Weekly goal deleted from Supabase');
      } catch (e) {
        console.error('Error deleting weekly goal from Supabase:', e);
      }
    },

    // 5. Save Log
    saveLog: async function (logObj) {
      const client = initClient();
      if (!client) return;
      try {
        await client.from('practice_logs').upsert({
          id: logObj.id,
          date: logObj.date,
          session_num: logObj.sessionNum,
          content: logObj.content,
          attendance: logObj.attendance,
          result: logObj.result,
          progress: logObj.progress,
          issues: logObj.issues,
          support_needed: logObj.supportNeeded,
          next_tasks: logObj.nextTasks,
          author: logObj.author
        }, { onConflict: 'id' });
        console.log('✅ Practice log saved to Supabase');
      } catch (e) {
        console.error('Error saving log to Supabase:', e);
      }
    },

    // Delete Log
    deleteLog: async function (logId) {
      const client = initClient();
      if (!client) return;
      try {
        await client.from('practice_logs').delete().eq('id', logId);
        console.log('✅ Practice log deleted from Supabase');
      } catch (e) {
        console.error('Error deleting log from Supabase:', e);
      }
    },

    // 6. Focused Notes CRUD
    saveNote: async function (category, noteObj) {
      const client = initClient();
      if (!client) return;
      try {
        const payload = {
          category: category,
          item_text: noteObj.text,
          is_checked: !!noteObj.checked
        };
        if (typeof noteObj.id === 'number' && noteObj.id < 10000000000) {
          payload.id = noteObj.id;
        }
        const { data, error } = await client.from('focused_notes').upsert(payload).select();
        if (!error && data && data.length > 0) {
          noteObj.id = data[0].id;
        }
        console.log('✅ Focused note saved to Supabase');
      } catch (e) {
        console.error('Error saving note to Supabase:', e);
      }
    },

    updateNoteChecked: async function (category, noteObj) {
      const client = initClient();
      if (!client) return;
      try {
        if (typeof noteObj.id === 'number' && noteObj.id < 10000000000) {
          await client.from('focused_notes').update({ is_checked: !!noteObj.checked }).eq('id', noteObj.id);
        } else {
          await client.from('focused_notes').update({ is_checked: !!noteObj.checked })
            .eq('category', category)
            .eq('item_text', noteObj.text);
        }
        console.log('✅ Note checked status updated in Supabase');
      } catch (e) {
        console.error('Error updating note status in Supabase:', e);
      }
    },

    deleteNote: async function (category, noteObj) {
      const client = initClient();
      if (!client) return;
      try {
        if (typeof noteObj.id === 'number' && noteObj.id < 10000000000) {
          await client.from('focused_notes').delete().eq('id', noteObj.id);
        } else {
          await client.from('focused_notes').delete()
            .eq('category', category)
            .eq('item_text', noteObj.text);
        }
        console.log('✅ Note deleted from Supabase');
      } catch (e) {
        console.error('Error deleting note from Supabase:', e);
      }
    }
  };

  window.SupabaseStore = SupabaseStore;
})(window);
