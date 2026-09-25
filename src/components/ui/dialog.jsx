import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils';

/**
 * Dialog, dressed as a printed insert: square corners, one hairline, the
 * house scrim behind it. A centred modal on desktop, a bottom sheet on phones
 * (motion lives in index.css under .dialog-panel). Radix supplies the parts
 * that are tedious to get right: focus trap, scroll lock, Escape, ARIA.
 */
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('dialog-scrim fixed inset-0 z-50', className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content ref={ref} className={cn('dialog-panel', className)} {...props}>
      {/*
        The close control stays pinned: the body scrolls, and a reader three
        screens into a build log still needs the way out in reach. It is a
        zero-height sticky row so it floats over the header instead of
        pushing it down.
      */}
      <div className="sticky top-0 z-20 h-0">
        <DialogPrimitive.Close className="btn btn-solid btn-icon absolute right-4 top-4 md:right-5 md:top-5">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true"
               fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
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
  <div className={cn('px-6 pt-8 pb-6 md:px-10 md:pt-10', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('font-bold text-3xl md:text-4xl tracking-[-0.03em] text-ink balance', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-ink-2 mt-2', className)}
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
  DialogTitle,
  DialogDescription,
};
