import * as React from 'react';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  type AlertDialogContentProps,
} from '@/components/animate-ui/components/radix/alert-dialog-primitives';
import { Button } from '@/components/ui/button';

interface RadixAlertDialogDemoProps {
  from?: AlertDialogContentProps['side'];
}

export const RadixAlertDialogDemo = ({ from }: RadixAlertDialogDemoProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-lg p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-slate-900">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm text-slate-600">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-6 flex justify-end gap-3">
          <AlertDialogCancel asChild>
            <Button variant="ghost">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive">Continue</Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RadixAlertDialogDemo;
