import { AdminTabType, UploadedFile, CustomPage, SiteSettings } from '@/types/adminTypes';
import DashboardTab from '@/components/admin/DashboardTab';
import SiteSettingsTab from '@/components/admin/SiteSettingsTab';
import ContentTab from '@/components/admin/ContentTab';
import FilesTab from '@/components/admin/FilesTab';
import StatsTab from '@/components/admin/StatsTab';
import QuickButtonsTab from '@/components/admin/QuickButtonsTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import VoiceDiagnostics from '@/components/VoiceDiagnostics';
import FullControlTab from '@/components/admin/FullControlTab';
import VisualEditorTab from '@/components/admin/VisualEditorTab';
import SecurityTab from '@/components/admin/SecurityTab';
import LanguagesTab from '@/components/admin/LanguagesTab';

interface AdminTabContentProps {
  activeTab: AdminTabType;
  uploadedFiles: UploadedFile[];
  customPages: CustomPage[];
  siteSettings: SiteSettings;
  isDragging: boolean;
  onUpdateSettings: (settings: SiteSettings) => void;
  onAddPage: () => void;
  onUpdatePage: (id: string, field: 'title' | 'content', value: string) => void;
  onDeletePage: (id: string) => void;
  onSavePages: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteFile: (idx: number) => void;
  onUpdateDescription: (idx: number, description: string) => void;
  onExportAll: () => void;
  onClearAll: () => void;
}

export default function AdminTabContent(props: AdminTabContentProps) {
  const {
    activeTab,
    uploadedFiles,
    customPages,
    siteSettings,
    isDragging,
    onUpdateSettings,
    onAddPage,
    onUpdatePage,
    onDeletePage,
    onSavePages,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileInput,
    onDeleteFile,
    onUpdateDescription,
    onExportAll,
    onClearAll
  } = props;

  if (activeTab === 'dashboard') {
    return (
      <DashboardTab 
        filesCount={uploadedFiles.length}
        pagesCount={customPages.length}
      />
    );
  }

  if (activeTab === 'site') {
    return (
      <SiteSettingsTab 
        settings={siteSettings}
        onUpdateSettings={onUpdateSettings}
      />
    );
  }

  if (activeTab === 'content') {
    return (
      <ContentTab
        pages={customPages}
        onAddPage={onAddPage}
        onUpdatePage={onUpdatePage}
        onDeletePage={onDeletePage}
        onSavePages={onSavePages}
      />
    );
  }

  if (activeTab === 'files') {
    return (
      <FilesTab
        files={uploadedFiles}
        isDragging={isDragging}
        allowedTypes={siteSettings.allowedTypes}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onFileInput={onFileInput}
        onDeleteFile={onDeleteFile}
        onUpdateDescription={onUpdateDescription}
        onExportAll={onExportAll}
        onClearAll={onClearAll}
      />
    );
  }

  if (activeTab === 'stats') {
    return (
      <StatsTab 
        files={uploadedFiles}
        pages={customPages}
      />
    );
  }

  if (activeTab === 'buttons') {
    return <QuickButtonsTab />;
  }

  if (activeTab === 'analytics') {
    return <AnalyticsTab />;
  }

  if (activeTab === 'voice') {
    return <VoiceDiagnostics />;
  }

  if (activeTab === 'control') {
    return <FullControlTab />;
  }

  if (activeTab === 'visual') {
    return <VisualEditorTab />;
  }

  if (activeTab === 'security') {
    return <SecurityTab />;
  }

  if (activeTab === 'languages') {
    return <LanguagesTab />;
  }

  return null;
}
