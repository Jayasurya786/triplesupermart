import * as RadixAlert from '@radix-ui/react-alert-dialog';
import React from 'react';

export const AlertDialog = RadixAlert.Root;
export const AlertDialogTrigger = RadixAlert.Trigger;
export const AlertDialogContent = RadixAlert.Content;
export const AlertDialogHeader = RadixAlert.Title;
export const AlertDialogTitle = RadixAlert.Title;
export const AlertDialogDescription = RadixAlert.Description;
export const AlertDialogFooter = RadixAlert.Action;
export const AlertDialogCancel = RadixAlert.Cancel;
export const AlertDialogAction = RadixAlert.Action;

// Types
export type AlertDialogContentProps = RadixAlert.AlertDialogContentProps;

export default RadixAlert;
