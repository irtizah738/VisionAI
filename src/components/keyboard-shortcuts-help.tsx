import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useTranslations } from "next-intl";

export function KeyboardShortcutsHelp() {
  const { shortcuts } = useKeyboardShortcuts();
  const t = useTranslations('accessibility');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label={t('keyboardShortcuts')}
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('keyboardShortcuts')}</DialogTitle>
          <DialogDescription>
            {t('keyboardShortcutsDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(shortcuts).map(([key, shortcut]) => (
            <div
              key={key}
              className="flex items-center justify-between"
              role="listitem"
            >
              <span className="text-sm font-medium">
                {t(`shortcuts.${key}`)}
              </span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {shortcut}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 