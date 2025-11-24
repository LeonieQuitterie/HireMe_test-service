// src/services/test.service.ts
import { supabase } from '../lib/supabase';
import { CreateTestDTO, ScheduleTestDTO } from '../types';

export class TestService {
  async createTest(data: CreateTestDTO) {
    const { job_id, test_name, duration_minutes, passing_score } = data;

    const { data: newTest, error } = await supabase
      .from('tests')
      .insert([{ job_id, test_name, duration_minutes, passing_score }])
      .select()
      .single();

    if (error) throw error;
    return newTest;
  }

  async getTestsByJob(jobId: string) {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getTestById(testId: string) {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();

    if (error) throw error;
    return data;
  }

  async getTestByAccessCode(accessCode: string) {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('access_code', accessCode)
      .eq('status', 'Open')
      .single();

    if (error) throw error;
    return data;
  }

  async scheduleTest(data: ScheduleTestDTO) {
    const { test_id, open_time, close_time, invite_recipients } = data;

    // Insert schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from('test_schedules')
      .insert([{ test_id, open_time, close_time }])
      .select()
      .single();

    if (scheduleError) throw scheduleError;

    // Insert invitations
    const invitations = invite_recipients.map(email => ({
      test_id,
      email
    }));

    const { error: invitationError } = await supabase
      .from('test_invitations')
      .insert(invitations);

    if (invitationError) throw invitationError;

    return { schedule, invitations: invite_recipients };
  }

  async updateTestStatus() {
    const { error } = await supabase.rpc('update_test_status');
    if (error) throw error;
    return { message: 'Test statuses updated' };
  }

  async deleteTest(testId: string) {
    const { error } = await supabase
      .from('tests')
      .delete()
      .eq('id', testId);

    if (error) throw error;
    return { message: 'Test deleted successfully' };
  }
}