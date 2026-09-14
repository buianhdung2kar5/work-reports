/**
 * Supabase Integration & Data Layer for Báo Cáo Tiến Độ Tập Văn Nghệ Sinh Viên
 * Tự động nạp thông số từ .env hoặc window.ENV_*
 */

(function (window) {
  'use strict';

  let rawUrl = window.ENV_SUPABASE_URL || ''; 
  const rawKey = window.ENV_SUPABASE_ANON_KEY || '';

  if (rawUrl.includes('/dashboard/project/')) {
    const projId = rawUrl.split('/dashboard/project/')[1].split('/')[0].split('?')[0];
    rawUrl = `https://${projId}.supabase.co`;
  }

  const SUPABASE_URL = rawUrl;
  const SUPABASE_ANON_KEY = rawKey;

  let supabaseClient = null;

  if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('⚡ Supabase Client initialized successfully with URL:', SUPABASE_URL);
    } catch (err) {
      console.warn('⚠️ Supabase init error, using LocalStorage fallback:', err);
    }
  } else {
    console.log('ℹ️ Supabase credentials not fully configured yet. Running in LocalStorage Fallback Mode.');
  }

  const SupabaseStore = {
    isConfigured: function () {
      return supabaseClient !== null;
    },

    // 1. Load data from Supabase or Fallback LocalStorage
    loadAllData: async function (fallbackData) {
      if (!this.isConfigured()) {
        return false;
      }

      try {
        const { data: overviewData, error: ovErr } = await supabaseClient.from('overview').select('*').limit(1);
        if (ovErr) throw ovErr;

        const { data: prioritiesData, error: prErr } = await supabaseClient.from('priorities').select('*').order('created_at', { ascending: true });
        if (prErr && prErr.code !== 'PGRST205') console.warn('Priorities fetch warning:', prErr);

        const { data: weeklyData, error: wkErr } = await supabaseClient.from('weekly_goals').select('*').order('sort_order', { ascending: true });
        if (wkErr) throw wkErr;

        const { data: logsData, error: logErr } = await supabaseClient.from('practice_logs').select('*').order('session_num', { ascending: true });
        if (logErr) throw logErr;

        const { data: notesData, error: ntErr } = await supabaseClient.from('focused_notes').select('*').order('sort_order', { ascending: true });
        if (ntErr) throw ntErr;

        if (overviewData && overviewData.length > 0) {
          const ov = overviewData[0];
          fallbackData.overview = {
            showName: ov.show_name,
            className: ov.class_name,
            teachers: ov.teachers,
            totalMembers: ov.total_members || 35,
            performanceDate: ov.performance_date,
            generalGoal: ov.general_goal,
            completionCriteria: ov.completion_criteria,
            overallStatus: ov.overall_status
          };
        }

        if (prioritiesData && prioritiesData.length > 0) {
          fallbackData.priorities = prioritiesData.map(p => ({
            id: p.id,
            task: p.task,
            author: p.author,
            date: p.date
          }));
        }

        if (weeklyData && weeklyData.length > 0) {
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

        if (logsData && logsData.length > 0) {
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

        if (notesData && notesData.length > 0) {
          const formattedNotes = { music: [], formation: [], costumes: [], schedule: [], health: [] };
          notesData.forEach(n => {
            if (formattedNotes[n.category]) {
              formattedNotes[n.category].push({ id: n.id, text: n.item_text, checked: n.is_checked });
            }
          });
          fallbackData.notes = formattedNotes;
        }

        console.log('✅ Synchronized all data from Supabase Cloud!');
        return true;
      } catch (err) {
        console.warn('⚠️ Error loading data from Supabase:', err.message || err);
        return false;
      }
    },

    // 2. Save Overview CMS Settings
    saveOverview: async function (ovObj) {
      if (!this.isConfigured()) return;
      try {
        const { data } = await supabaseClient.from('overview').select('id').limit(1);
        const overviewId = (data && data.length > 0) ? data[0].id : undefined;

        await supabaseClient.from('overview').upsert({
          ...(overviewId ? { id: overviewId } : {}),
          show_name: ovObj.showName,
          class_name: ovObj.className,
          teachers: ovObj.teachers,
          total_members: ovObj.totalMembers || 35,
          performance_date: ovObj.performanceDate,
          general_goal: ovObj.generalGoal,
          completion_criteria: ovObj.completionCriteria,
          overall_status: ovObj.overallStatus
        });
        console.log('✅ Overview saved to Supabase');
      } catch (e) {
        console.error('Error saving overview to Supabase:', e);
      }
    },

    // 3. Save Priority Item
    savePriority: async function (pItem) {
      if (!this.isConfigured()) return;
      try {
        await supabaseClient.from('priorities').upsert({
          id: pItem.id,
          task: pItem.task,
          author: pItem.author,
          date: pItem.date
        });
        console.log('✅ Priority saved to Supabase');
      } catch (e) {
        console.error('Error saving priority to Supabase:', e);
      }
    },

    // Delete Priority Item
    deletePriority: async function (pId) {
      if (!this.isConfigured()) return;
      try {
        await supabaseClient.from('priorities').delete().eq('id', pId);
        console.log('✅ Priority deleted from Supabase');
      } catch (e) {
        console.error('Error deleting priority from Supabase:', e);
      }
    },

    // 4. Save Weekly Goal
    saveWeeklyGoal: async function (weekObj) {
      if (!this.isConfigured()) return;
      try {
        await supabaseClient.from('weekly_goals').upsert({
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
        });
      } catch (e) {
        console.error('Error saving weekly goal to Supabase:', e);
      }
    },

    // Delete Weekly Goal
    deleteWeeklyGoal: async function (weekId) {
      if (!this.isConfigured()) return;
      try {
        await supabaseClient.from('weekly_goals').delete().eq('id', weekId);
      } catch (e) {
        console.error('Error deleting weekly goal from Supabase:', e);
      }
    },

    // 5. Save Log
    saveLog: async function (logObj) {
      if (!this.isConfigured()) return;
      try {
        await supabaseClient.from('practice_logs').upsert({
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
        });
      } catch (e) {
        console.error('Error saving log to Supabase:', e);
      }
    },

    // Delete Log
    deleteLog: async function (logId) {
      if (!this.isConfigured()) return;
      try {
        await supabaseClient.from('practice_logs').delete().eq('id', logId);
      } catch (e) {
        console.error('Error deleting log from Supabase:', e);
      }
    }
  };

  window.SupabaseStore = SupabaseStore;
})(window);
