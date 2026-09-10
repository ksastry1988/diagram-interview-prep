import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrawingStore } from '../store/drawingStore';
import { useAuthStore } from '../store/authStore';
import Toolbar from '../components/Toolbar';
import DrawingCanvas from '../components/DrawingCanvas';
import Sidebar from '../components/Sidebar';
import * as api from '../services/apiClient';
import { exportCanvasAsImage } from '../utils/canvasUtils';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { canvas } = useDrawingStore();
  const [title, setTitle] = useState('Untitled Diagram');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Load existing diagram
  useEffect(() => {
    if (id && canvas) {
      loadDiagram();
    }
  }, [id, canvas]);

  const loadDiagram = async () => {
    try {
      const response = await api.getDiagram(id!);
      setTitle(response.data.title);
      if (response.data.content && canvas) {
        canvas.loadFromJSON(response.data.content, () => {
          canvas.renderAll();
        });
      }
    } catch (error) {
      console.error('Failed to load diagram:', error);
    }
  };

  const handleSave = async () => {
    if (!canvas) return;

    setIsSaving(true);
    try {
      const content = canvas.toJSON();
      
      if (id) {
        // Update existing diagram
        await api.updateDiagram(id, { title, content });
      } else {
        // Create new diagram
        const response = await api.createDiagram({ title, content });
        navigate(`/editor/${response.data.id}`);
      }

      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to save diagram:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!canvas) return;

    // Show export options
    const format = window.prompt('Export as (png/jpg/svg):', 'png');
    if (format && ['png', 'jpg', 'svg'].includes(format)) {
      exportCanvasAsImage(canvas, format as 'png' | 'jpg' | 'svg');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Back
          </button>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-indigo-600 outline-none"
            />
            {lastSaved && (
              <p className="text-xs text-gray-500">Saved at {lastSaved}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSaving && <p className="text-sm text-gray-600">Saving...</p>}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
          >
            💾 Save
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar onSave={handleSave} onExport={handleExport} />

      {/* Main Canvas Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with Templates */}
        <Sidebar />

        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <DrawingCanvas />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
