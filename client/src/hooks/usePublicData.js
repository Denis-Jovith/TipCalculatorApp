import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

const initialState = {
  settings: null,
  skills: [],
  experience: [],
  education: [],
  projects: [],
  achievements: [],
  recommendations: [],
  socialLinks: [],
  loading: true,
  error: null
};

export function usePublicData() {
  const [state, setState] = useState(initialState);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [settings, skills, experience, education, projects, achievements, recommendations, socialLinks] =
        await Promise.all([
          api.get('/settings').then((r) => r.data),
          api.get('/skills').then((r) => r.data),
          api.get('/experience').then((r) => r.data),
          api.get('/education').then((r) => r.data),
          api.get('/projects').then((r) => r.data),
          api.get('/achievements').then((r) => r.data),
          api.get('/recommendations').then((r) => r.data),
          api.get('/social-links').then((r) => r.data)
        ]);
      setState({
        settings,
        skills,
        experience,
        education,
        projects,
        achievements,
        recommendations,
        socialLinks,
        loading: false,
        error: null
      });
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refetch: load };
}
