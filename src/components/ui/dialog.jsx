import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils';

/**
 * Dialog, dressed as a printed insert: square corners, hairline rules,
 * a halftone strip across the head. Radix supplies the parts that are
 * tedious to get right — focus trap, scroll lock, Escape, ARIA wiring.
 */
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-paper/85 backdrop-blur-[3px]',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2',
        'max-h-[88vh] overflow-y-auto border rule bg-paper shadow-[0_24px_80px_-12px_rgba(0,0,0,0.8)]',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98]',
        className
      )}
      {...props}
    >
      {/*
        Head furniture stays pinned: the dialog body scrolls, and a reader
        three screens into a build log still needs the way out in reach.
      */}
      <div className="sticky top-0 z-20">
        <div className="dot-pattern h-2 text-ink bg-paper" aria-hidden="true" />
        {/* Zero-height fade so body copy dissolves under the pinned control
            instead of colliding with it. */}
        <div className="h-16 -mb-16 bg-gradient-to-b from-paper via-paper/95 to-transparent"
             aria-hidden="true" />
        <DialogPrimitive.Close
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center
                     border rule bg-paper text-inkSoft hover:text-paper hover:bg-flame
                     transition-colors"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true"
               fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => (
  <div className={cn('px-7 pt-7 pb-5 md:px-10 md:pt-9', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }) => (
  <div className={cn('px-7 py-6 md:px-10 border-t rule', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('font-display text-3xl md:text-4xl text-ink balance', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('font-mono text-sm text-inkSoft mt-1.5', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
