import AdminLogin from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabNavigation from '@/components/admin/AdminTabNavigation';
import AdminTabContent from '@/components/admin/AdminTabContent';
import { useAdminState } from '@/hooks/useAdminState';

export default function Admin() {
  const {
    uploadedFiles,
    isDragging,
    isAuthenticated,
    activeTab,
    siteSettings,
    customPages,
    setActiveTab,
    setSiteSettings,
    exportAllData,
    clearAllData,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    handleDeleteFile,
    handleUpdateDescription,
    addNewPage,
    updatePage,
    deletePage,
    savePages,
    handleLogin,
    handleLogout
  } = useAdminState();

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      
      <div className="relative z-10">
        <AdminHeader onLogout={handleLogout} />

        <main className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Панель управления</h1>
            <p className="text-purple-200">Управляйте контентом и настройками вашего сайта</p>
          </div>
          
          <AdminTabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <AdminTabContent
            activeTab={activeTab}
            uploadedFiles={uploadedFiles}
            customPages={customPages}
            siteSettings={siteSettings}
            isDragging={isDragging}
            onUpdateSettings={setSiteSettings}
            onAddPage={addNewPage}
            onUpdatePage={updatePage}
            onDeletePage={deletePage}
            onSavePages={savePages}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileInput={handleFileInput}
            onDeleteFile={handleDeleteFile}
            onUpdateDescription={handleUpdateDescription}
            onExportAll={exportAllData}
            onClearAll={clearAllData}
          />
        </main>
      </div>
    </div>
  );
}
