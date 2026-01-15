'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea } from '@/components/ui';
import { CodeEditor, LanguageSelect, SourceSelect } from '@/components/editor';
import { SupportedLanguage, CodeSource } from '@/types';

interface PostFormProps {
  onSuccess?: () => void;
}

export default function PostForm({ onSuccess }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('// Paste your code here\n');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [source, setSource] = useState<CodeSource>('other');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          code,
          language,
          source,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }

      const post = await response.json();
      onSuccess?.();
      router.push(`/post/${post._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          role="alert"
        >
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What's this code about?"
        required
        maxLength={200}
      />

      <Textarea
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add some context - what are you trying to understand or review?"
        maxLength={2000}
        className="min-h-[80px]"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LanguageSelect
          value={language}
          onChange={setLanguage}
        />
        <SourceSelect
          value={source}
          onChange={setSource}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Code
        </label>
        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
          height={300}
          label="Enter code to share"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!title.trim() || !code.trim()}
        >
          Share Code
        </Button>
      </div>
    </form>
  );
}
