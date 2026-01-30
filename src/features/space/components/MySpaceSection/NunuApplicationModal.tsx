'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Modal, Button, Badge } from '@/components/atoms';
import { VideoUpload } from '@/components/molecules';
import { NUNU_APPLICATION_QUESTIONS } from '../../constants';
import { cn } from '@/lib/utils';

interface NunuApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NunuApplicationFormData) => Promise<void>;
}

export interface NunuApplicationFormData {
  expertise: string[];
  discordId: string;
  applicationText: string;
  situationalAnswers: {
    question1: string;
    question2: string;
    question3: string;
  };
  introVideo: File | null;
}

const EXPERTISE_OPTIONS = [
  'JLPT N5-N4',
  'JLPT N3-N2',
  'JLPT N1',
  'Conversation Practice',
  'Reading Comprehension',
  'Listening Practice',
  'Grammar',
  'Vocabulary',
  'Kanji',
  'Business Japanese',
  'Anime/Media Japanese',
  'Study Methods',
];

const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Tell us about yourself' },
  { id: 2, title: 'Situations', description: 'Leadership scenarios' },
  { id: 3, title: 'Video Intro', description: 'Introduce yourself' },
  { id: 4, title: 'Review', description: 'Submit application' },
];

export function NunuApplicationModal({ isOpen, onClose, onSubmit }: NunuApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<NunuApplicationFormData>({
    expertise: [],
    discordId: '',
    applicationText: '',
    situationalAnswers: {
      question1: '',
      question2: '',
      question3: '',
    },
    introVideo: null,
  });

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string> = {};

      if (step === 1) {
        if (formData.expertise.length === 0) {
          newErrors.expertise = 'Please select at least one area of expertise';
        }
        if (!formData.discordId.trim()) {
          newErrors.discordId = 'Discord ID is required';
        } else if (!/^.{2,32}#[0-9]{4}$|^[a-z0-9_.]{2,32}$/.test(formData.discordId.trim())) {
          newErrors.discordId = 'Please enter a valid Discord username';
        }
        if (!formData.applicationText.trim()) {
          newErrors.applicationText = 'Please tell us why you want to become a Nunu';
        } else if (formData.applicationText.trim().length < 50) {
          newErrors.applicationText = 'Please write at least 50 characters';
        }
      }

      if (step === 2) {
        NUNU_APPLICATION_QUESTIONS.forEach((q) => {
          const answer = formData.situationalAnswers[q.id as keyof typeof formData.situationalAnswers];
          if (!answer.trim()) {
            newErrors[q.id] = 'This question is required';
          } else if (answer.trim().length < q.minLength) {
            newErrors[q.id] = `Please write at least ${q.minLength} characters`;
          }
        });
      }

      if (step === 3) {
        if (!formData.introVideo) {
          newErrors.video = 'Please upload an introduction video';
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  }, [currentStep, validateStep]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        expertise: [],
        discordId: '',
        applicationText: '',
        situationalAnswers: { question1: '', question2: '', question3: '' },
        introVideo: null,
      });
      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error('Failed to submit application:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, onClose, validateStep]);

  const toggleExpertise = useCallback((expertise: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter((e) => e !== expertise)
        : [...prev.expertise, expertise],
    }));
  }, []);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [isSubmitting, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Apply to Become a Nunu" size="lg">
      <div className="p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors',
                      currentStep >= step.id
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-neutral-600 bg-neutral-800 text-neutral-400'
                    )}
                  >
                    {currentStep > step.id ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-2 text-xs font-medium',
                      currentStep >= step.id ? 'text-white' : 'text-neutral-500'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-0.5 w-12 sm:w-16 transition-colors',
                      currentStep > step.id ? 'bg-primary-500' : 'bg-neutral-700'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Areas of Expertise</h3>
                <p className="mb-4 text-sm text-neutral-400">
                  Select the areas where you can help other learners
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_OPTIONS.map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => toggleExpertise(exp)}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-medium transition-all',
                        formData.expertise.includes(exp)
                          ? 'bg-primary-500 text-white'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      )}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
                {errors.expertise && <p className="mt-2 text-sm text-red-400">{errors.expertise}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">Discord Username</label>
                <input
                  type="text"
                  value={formData.discordId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, discordId: e.target.value }))}
                  placeholder="e.g., username or username#1234"
                  className={cn(
                    'w-full rounded-lg border bg-neutral-800 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                    errors.discordId ? 'border-red-500' : 'border-neutral-700'
                  )}
                />
                {errors.discordId && <p className="mt-2 text-sm text-red-400">{errors.discordId}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Why do you want to become a Nunu?
                </label>
                <textarea
                  value={formData.applicationText}
                  onChange={(e) => setFormData((prev) => ({ ...prev, applicationText: e.target.value }))}
                  placeholder="Share your motivation for helping others learn Japanese..."
                  rows={4}
                  className={cn(
                    'w-full rounded-lg border bg-neutral-800 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none',
                    errors.applicationText ? 'border-red-500' : 'border-neutral-700'
                  )}
                />
                <div className="mt-1 flex justify-between text-xs">
                  {errors.applicationText ? (
                    <p className="text-red-400">{errors.applicationText}</p>
                  ) : (
                    <span className="text-neutral-500">Minimum 50 characters</span>
                  )}
                  <span className="text-neutral-500">{formData.applicationText.length} characters</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Situational Questions */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Leadership Scenarios</h3>
                <p className="text-sm text-neutral-400">
                  Tell us how you would handle these situations as a Nunu
                </p>
              </div>

              {NUNU_APPLICATION_QUESTIONS.map((q, index) => {
                const answerId = q.id as keyof typeof formData.situationalAnswers;
                const answer = formData.situationalAnswers[answerId];
                return (
                  <div key={q.id} className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4">
                    <div className="mb-3 flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-xs font-semibold text-primary-400">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium text-white">{q.question}</p>
                    </div>
                    <textarea
                      value={answer}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          situationalAnswers: {
                            ...prev.situationalAnswers,
                            [answerId]: e.target.value,
                          },
                        }))
                      }
                      placeholder={q.placeholder}
                      rows={4}
                      className={cn(
                        'w-full rounded-lg border bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none',
                        errors[q.id] ? 'border-red-500' : 'border-neutral-700'
                      )}
                    />
                    <div className="mt-1 flex justify-between text-xs">
                      {errors[q.id] ? (
                        <p className="text-red-400">{errors[q.id]}</p>
                      ) : (
                        <span className="text-neutral-500">Minimum {q.minLength} characters</span>
                      )}
                      <span className="text-neutral-500">{answer.length} characters</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Step 3: Video Upload */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Introduction Video</h3>
                <p className="mb-6 text-sm text-neutral-400">
                  Record a short video introducing yourself. Tell us about your Japanese learning journey,
                  your teaching experience, and why you&apos;d make a great Nunu mentor.
                </p>

                <div className="mb-4 rounded-lg border border-primary-500/30 bg-primary-500/10 p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-medium text-primary-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Video Tips
                  </h4>
                  <ul className="space-y-1 text-sm text-neutral-300">
                    <li>• Keep it between 1-3 minutes</li>
                    <li>• Speak clearly and show your personality</li>
                    <li>• Mention your Japanese level and specialties</li>
                    <li>• Share what excites you about helping others</li>
                  </ul>
                </div>

                <VideoUpload
                  value={formData.introVideo}
                  onChange={(file) => setFormData((prev) => ({ ...prev, introVideo: file }))}
                  maxSizeMB={100}
                  maxDurationSeconds={180}
                  error={errors.video}
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Review Your Application</h3>
                <p className="mb-6 text-sm text-neutral-400">
                  Please review your application before submitting
                </p>
              </div>

              {/* Summary Cards */}
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium text-white">Basic Information</h4>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-primary-400 hover:text-primary-300"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-neutral-400">Discord:</span>{' '}
                      <span className="text-white">{formData.discordId}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Expertise:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {formData.expertise.map((exp) => (
                          <Badge key={exp} variant="default" size="sm">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-400">Motivation:</span>
                      <p className="mt-1 text-neutral-300">{formData.applicationText}</p>
                    </div>
                  </div>
                </div>

                {/* Situational Answers */}
                <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium text-white">Situational Responses</h4>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-sm text-primary-400 hover:text-primary-300"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-3 text-sm">
                    {NUNU_APPLICATION_QUESTIONS.map((q, index) => {
                      const answerId = q.id as keyof typeof formData.situationalAnswers;
                      return (
                        <div key={q.id}>
                          <p className="text-neutral-400">Q{index + 1}: {q.question.substring(0, 50)}...</p>
                          <p className="mt-1 text-neutral-300 line-clamp-2">
                            {formData.situationalAnswers[answerId]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Video Preview */}
                <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium text-white">Introduction Video</h4>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-sm text-primary-400 hover:text-primary-300"
                    >
                      Edit
                    </button>
                  </div>
                  {formData.introVideo && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="rounded-lg bg-primary-500/20 p-2">
                        <svg className="h-5 w-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-white">{formData.introVideo.name}</p>
                        <p className="text-neutral-400">
                          {(formData.introVideo.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {errors.submit && (
                <p className="text-center text-sm text-red-400">{errors.submit}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between border-t border-neutral-700 pt-6">
          <Button
            variant="ghost"
            onClick={currentStep === 1 ? handleClose : handleBack}
            disabled={isSubmitting}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep < 4 ? (
            <Button onClick={handleNext}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
