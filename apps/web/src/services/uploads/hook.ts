import { useMutation } from '@tanstack/react-query';
import api from '../api';

export function useUpload() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api
        .post('/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data.data ?? r.data);
    },
  });
}
