'use client';

import { useState, useCallback } from 'react';
import { Modal, Button } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { MonthSelector } from './MonthSelector';
import type { MatchingPostType, PriceType } from '@/features/space/types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostData) => void;
  isNunu?: boolean;
}

export interface CreatePostData {
  type: MatchingPostType;
  title: string;
  content: string;
  priceType: PriceType;
  priceAmount?: number;
  priceMin?: number;
  priceMax?: number;
  availableMonths: string[];
  maxSlots?: number;
  tags: string[];
}

export function CreatePostModal({ isOpen, onClose, onSubmit, isNunu = false }: CreatePostModalProps) {
  const [postType, setPostType] = useState<MatchingPostType>(
    isNunu ? 'nunu-looking-for-vava' : 'vava-looking-for-nunu'
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priceType, setPriceType] = useState<PriceType>('fixed');
  const [priceAmount, setPriceAmount] = useState<string>('');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [maxSlots, setMaxSlots] = useState<string>('3');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNunuPost = postType === 'nunu-looking-for-vava';

  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tag: string) => {
    setTags(tags.filter(t => t !== tag));
  }, [tags]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || selectedMonths.length === 0) {
      return;
    }

    setIsSubmitting(true);

    const data: CreatePostData = {
      type: postType,
      title: title.trim(),
      content: content.trim(),
      priceType,
      availableMonths: selectedMonths,
      tags,
    };

    if (isNunuPost) {
      if (priceType === 'fixed' && priceAmount) {
        data.priceAmount = parseInt(priceAmount, 10);
      }
      data.maxSlots = parseInt(maxSlots, 10) || 3;
    } else {
      if (priceType === 'range') {
        if (priceMin) data.priceMin = parseInt(priceMin, 10);
        if (priceMax) data.priceMax = parseInt(priceMax, 10);
      }
    }

    onSubmit(data);
    setIsSubmitting(false);
    onClose();

    // Reset form
    setTitle('');
    setContent('');
    setPriceAmount('');
    setPriceMin('');
    setPriceMax('');
    setSelectedMonths([]);
    setTags([]);
  }, [postType, title, content, priceType, priceAmount, priceMin, priceMax, selectedMonths, maxSlots, tags, isNunuPost, onSubmit, onClose]);

  const isValid = title.trim() && content.trim() && selectedMonths.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create Post</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Post Type Switch */}
        <div className="mb-6">
          <label className="text-sm text-neutral-400 mb-2 block">I am a...</label>
          <div className="flex rounded-lg bg-neutral-800 p-1">
            <button
              type="button"
              onClick={() => setPostType('vava-looking-for-nunu')}
              className={cn(
                'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                postType === 'vava-looking-for-nunu'
                  ? 'bg-amber-500 text-white'
                  : 'text-neutral-400 hover:text-white'
              )}
            >
              Vava Looking for Nunu
            </button>
            <button
              type="button"
              onClick={() => setPostType('nunu-looking-for-vava')}
              className={cn(
                'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                postType === 'nunu-looking-for-vava'
                  ? 'bg-green-500 text-white'
                  : 'text-neutral-400 hover:text-white'
              )}
              disabled={!isNunu}
              title={!isNunu ? 'You must be an approved Nunu to create this type of post' : undefined}
            >
              Nunu Looking for Vava
            </button>
          </div>
          {!isNunu && postType === 'nunu-looking-for-vava' && (
            <p className="text-xs text-amber-400 mt-2">
              You must be an approved Nunu to create a "Find Vava" post
            </p>
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="text-sm text-neutral-400 mb-2 block">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isNunuPost ? "e.g., Automation Expert Looking for Vava!" : "e.g., Beginner Looking for Patient Nunu!"}
            className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength={100}
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label className="text-sm text-neutral-400 mb-2 block">Description</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isNunuPost
              ? "Describe what you offer, your expertise, teaching style..."
              : "Describe what you want to learn, your goals, current level..."}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            maxLength={500}
          />
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <label className="text-sm text-neutral-400 mb-2 block">
            {isNunuPost ? 'Monthly Price (TWD)' : 'Budget (TWD/month)'}
          </label>

          {isNunuPost ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPriceType('fixed')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                    priceType === 'fixed'
                      ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                  )}
                >
                  Fixed Price
                </button>
                <button
                  type="button"
                  onClick={() => setPriceType('negotiable')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                    priceType === 'negotiable'
                      ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                  )}
                >
                  Negotiable
                </button>
              </div>
              {priceType === 'fixed' && (
                <input
                  type="number"
                  value={priceAmount}
                  onChange={(e) => setPriceAmount(e.target.value)}
                  placeholder="e.g., 800"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => {
                    setPriceMin(e.target.value);
                    setPriceType('range');
                  }}
                  placeholder="Min (e.g., 500)"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <span className="flex items-center text-neutral-500">to</span>
              <div className="flex-1">
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => {
                    setPriceMax(e.target.value);
                    setPriceType('range');
                  }}
                  placeholder="Max (e.g., 1000)"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Month Selector */}
        <div className="mb-4">
          <MonthSelector
            selectedMonths={selectedMonths}
            onMonthsChange={setSelectedMonths}
          />
        </div>

        {/* Max Slots (Nunu only) */}
        {isNunuPost && (
          <div className="mb-4">
            <label className="text-sm text-neutral-400 mb-2 block">Max Vavas You Can Take</label>
            <select
              value={maxSlots}
              onChange={(e) => setMaxSlots(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n} Vava{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        )}

        {/* Tags */}
        <div className="mb-6">
          <label className="text-sm text-neutral-400 mb-2 block">Tags (max 5)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., ChatGPT, Automation, Beginner"
              className="flex-1 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={tags.length >= 5}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || tags.length >= 5}
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-800 text-sm text-neutral-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-neutral-500 hover:text-white"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid || isSubmitting} className="flex-1">
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
