import { CaretLeft } from '@phosphor-icons/react'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { sidebarComponents } from '../../data/sidebar-components'
import { EHTMLTag } from '../../types/EHTMLTag'
import { EPosition } from '../../types/EPosition'

interface SidebarProps {
  isCanvasEmpty: boolean;
  editingComponentId: string | null;
  componentStyle: React.CSSProperties;
  onDragStart: (type: EHTMLTag, position: EPosition, event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onUpdateStyle: (id: string, updatedStyle: React.CSSProperties) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCanvasEmpty,
  editingComponentId,
  componentStyle,
  onDragStart,
  onDragEnd,
  onUpdateStyle,
}) => {
  const [position, setPosition] = useState<EPosition>(EPosition.RELATIVE);
  const [activeSections, setActiveSections] = useState<string[]>([]);
  const [backgroundGradient, setBackgroundGradient] = useState({
    enabled: false,
    direction: 'to right',
    startColor: '#ffffff',
    endColor: '#000000',
  });

  // Використання useEffect для ініціалізації градієнта
  useEffect(() => {
    if (componentStyle.backgroundImage) {
      const gradientMatch = componentStyle.backgroundImage.match(/linear-gradient\(([^,]+),\s*(#[0-9A-Fa-f]+),\s*(#[0-9A-Fa-f]+)\)/);
      if (gradientMatch) {
        setBackgroundGradient({
          enabled: true,
          direction: gradientMatch[1],
          startColor: gradientMatch[2],
          endColor: gradientMatch[3],
        });
      }
    }
  }, [componentStyle.backgroundImage]);

  const toggleSection = (section: string) => {
    setActiveSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedStyle = { ...componentStyle, [name]: value };
    onUpdateStyle(editingComponentId as string, updatedStyle);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedStyle = { ...componentStyle, [name]: `${value}px` };
    onUpdateStyle(editingComponentId as string, updatedStyle);
  };

  useEffect(() => {
    const debouncedHandleGradientChange = _.debounce((gradient) => {
      if (gradient.enabled) {
        const updatedStyle = {
          backgroundImage: `linear-gradient(${gradient.direction}, ${gradient.startColor}, ${gradient.endColor})`,
        };
        onUpdateStyle(editingComponentId as string, updatedStyle);
      } else {
        onUpdateStyle(editingComponentId as string, { backgroundImage: '' });
      }
    }, 5);

    debouncedHandleGradientChange(backgroundGradient);

    return () => {
      debouncedHandleGradientChange.cancel();
    };
  }, [backgroundGradient, editingComponentId, onUpdateStyle]);

  const handleGradientColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBackgroundGradient(prev => ({ ...prev, [name]: value }));
  };

  const handleGradientDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBackgroundGradient(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleGradient = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setBackgroundGradient(prev => ({ ...prev, enabled }));
  };

  const handleDisplayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    let updatedStyle: React.CSSProperties = {
      display: value,
    };

    if (value === 'flex') {
      updatedStyle = {
        ...updatedStyle,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: '0px',
      };
    } else if (value === 'grid') {
      updatedStyle = {
        ...updatedStyle,
        gridTemplateColumns: '',
        gridTemplateRows: '',
        gap: '0px',
      };
    }

    onUpdateStyle(editingComponentId as string, updatedStyle);
  };

  return (
    <aside className="w-1/4 max-h-full px-5 overflow-y-auto py-7 bg-stone-900">
      <div className="flex justify-between mb-4">
        {!editingComponentId ? (
          <h2 className="text-xl">Components</h2>
        ) : (
          <div className="flex items-center">
            <CaretLeft className="text-white cursor-pointer" size={24} />
            <h2 className="ml-2 text-xl">Properties</h2>
          </div>
        )}
      </div>

      {!editingComponentId && (
        <>
          <div className="mb-4">
            <label className="block mb-2 text-white">Position</label>
            <select
              value={position}
              onChange={e => setPosition(e.target.value as EPosition)}
              className="p-2 text-white rounded bg-stone-700"
            >
              <option value={EPosition.RELATIVE}>Relative</option>
              <option value={EPosition.ABSOLUTE}>Absolute</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {sidebarComponents.map(({ icon: IconComponent, type }) => {
              const isSection = type === EHTMLTag.SECTION;
              const isDisabled = isCanvasEmpty ? !isSection : false;
              return (
                <div
                  key={type}
                  draggable={!isDisabled}
                  onDragStart={event =>
                    !isDisabled && onDragStart(type, position, event)
                  }
                  onDragEnd={onDragEnd}
                  className={`flex flex-col items-center justify-center gap-2 p-2 mb-2 text-white bg-white border-2 border-purple-800 cursor-pointer aspect-square rounded-xl bg-opacity-10 ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <IconComponent size={24} weight="bold" />
                  <span className="font-bold">{`</${type}>`}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {editingComponentId && (
        <div className="flex flex-col gap-4">
          {/* Background Section */}
          <div className="group">
            <div className="flex justify-between cursor-pointer" onClick={() => toggleSection('background')}>
              <span className="text-white">Background</span>
              <span>{activeSections.includes('background') ? '▲' : '▼'}</span>
            </div>
            {activeSections.includes('background') && (
              <div className="mt-2">
                <label className="block mb-2 text-white">Background Color</label>
                <input
                  type="color"
                  name="backgroundColor"
                  value={componentStyle.backgroundColor || '#ffffff'}
                  onChange={handleInputChange}
                  className="w-full h-10 px-2 py-1 border rounded"
                />
                <div className="mt-4">
                  <label className="flex items-center mb-2 text-white">
                    <input
                      type="checkbox"
                      name="enableGradient"
                      checked={backgroundGradient.enabled}
                      onChange={handleToggleGradient}
                      className="mr-2"
                    />
                    Enable Gradient
                  </label>
                  {backgroundGradient.enabled && (
                    <>
                      <select
                        name="direction"
                        value={backgroundGradient.direction}
                        onChange={handleGradientDirectionChange}
                        className="w-full p-2 mb-2 text-white rounded bg-stone-700"
                      >
                        <option value="to right">To Right</option>
                        <option value="to left">To Left</option>
                        <option value="to bottom">To Bottom</option>
                        <option value="to top">To Top</option>
                      </select>
                      <input
                        type="color"
                        name="startColor"
                        value={backgroundGradient.startColor}
                        onChange={handleGradientColorChange}
                        className="w-full h-10 px-2 py-1 mb-2 border rounded"
                      />
                      <input
                        type="color"
                        name="endColor"
                        value={backgroundGradient.endColor}
                        onChange={handleGradientColorChange}
                        className="w-full h-10 px-2 py-1 border rounded"
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Border Section */}
          <div className="group">
            <div className="flex justify-between cursor-pointer" onClick={() => toggleSection('border')}>
              <span className="text-white">Border</span>
              <span>{activeSections.includes('border') ? '▲' : '▼'}</span>
            </div>
            {activeSections.includes('border') && (
              <div className="mt-2">
                <label className="block mb-2 text-white">Border Width</label>
                <input
                  type="range"
                  name="borderWidth"
                  min="0"
                  max="20"
                  value={parseInt(componentStyle.borderWidth as string) || 0}
                  onChange={handleRangeChange}
                  className="w-full"
                />
                <span className="text-white">{parseInt(componentStyle.borderWidth as string) || 0}px</span>
                <label className="block mt-4 mb-2 text-white">Border Color</label>
                <input
                  type="color"
                  name="borderColor"
                  value={componentStyle.borderColor || '#000000'}
                  onChange={handleInputChange}
                  className="w-full h-10 px-2 py-1 border rounded"
                />
                <label className="block mt-4 mb-2 text-white">Border Style</label>
                <select
                  name="borderStyle"
                  value={componentStyle.borderStyle || 'solid'}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const { name, value } = e.target;
                    const updatedStyle = { ...componentStyle, [name]: value };
                    onUpdateStyle(editingComponentId as string, updatedStyle);
                  }}
                  className="w-full p-2 mb-2 text-white rounded bg-stone-700"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                </select>
                <label className="block mt-4 mb-2 text-white">Border Radius</label>
                <input
                  type="range"
                  name="borderRadius"
                  min="0"
                  max="50"
                  value={parseInt(componentStyle.borderRadius as string) || 0}
                  onChange={handleRangeChange}
                  className="w-full"
                />
                <span className="text-white">{parseInt(componentStyle.borderRadius as string) || 0}px</span>
              </div>
            )}
          </div>

          {/* Padding & Margin Section */}
          <div className="group">
            <div className="flex justify-between cursor-pointer" onClick={() => toggleSection('spacing')}>
              <span className="text-white">Spacing</span>
              <span>{activeSections.includes('spacing') ? '▲' : '▼'}</span>
            </div>
            {activeSections.includes('spacing') && (
              <div className="mt-2">
                <label className="block mb-2 text-white">Padding</label>
                <input
                  type="range"
                  name="padding"
                  min="0"
                  max="100"
                  value={parseInt(componentStyle.padding as string) || 0}
                  onChange={handleRangeChange}
                  className="w-full"
                />
                <span className="text-white">{parseInt(componentStyle.padding as string) || 0}px</span>

                <label className="block mt-4 mb-2 text-white">Margin</label>
                <input
                  type="range"
                  name="margin"
                  min="0"
                  max="100"
                  value={parseInt(componentStyle.margin as string) || 0}
                  onChange={handleRangeChange}
                  className="w-full"
                />
                <span className="text-white">{parseInt(componentStyle.margin as string) || 0}px</span>
              </div>
            )}
          </div>

          {/* Display Section */}
          <div className="group">
            <div className="flex justify-between cursor-pointer" onClick={() => toggleSection('display')}>
              <span className="text-white">Display</span>
              <span>{activeSections.includes('display') ? '▲' : '▼'}</span>
            </div>
            {activeSections.includes('display') && (
              <div className="mt-2">
                <label className="block mb-2 text-white">Display Type</label>
                <select
                  name="display"
                  value={componentStyle.display || 'block'}
                  onChange={handleDisplayChange}
                  className="w-full p-2 mb-2 text-white rounded bg-stone-700"
                >
                  <option value="block">Block</option>
                  <option value="flex">Flex</option>
                  <option value="grid">Grid</option>
                </select>

                {/* Flex options */}
                {componentStyle.display === 'flex' && (
                  <div className="mt-2">
                    <label className="block mb-2 text-white">Flex Direction</label>
                    <select
                      name="flexDirection"
                      value={componentStyle.flexDirection || 'row'}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const { name, value } = e.target;
                        const updatedStyle = { ...componentStyle, [name]: value };
                        onUpdateStyle(editingComponentId as string, updatedStyle);
                      }}
                      className="w-full p-2 mb-2 text-white rounded bg-stone-700"
                    >
                      <option value="row">Row</option>
                      <option value="row-reverse">Row Reverse</option>
                      <option value="column">Column</option>
                      <option value="column-reverse">Column Reverse</option>
                    </select>

                    <label className="block mb-2 text-white">Justify Content</label>
                    <select
                      name="justifyContent"
                      value={componentStyle.justifyContent || 'flex-start'}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const { name, value } = e.target;
                        const updatedStyle = { ...componentStyle, [name]: value };
                        onUpdateStyle(editingComponentId as string, updatedStyle);
                      }}
                      className="w-full p-2 mb-2 text-white rounded bg-stone-700"
                    >
                      <option value="flex-start">Flex Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">Flex End</option>
                      <option value="space-between">Space Between</option>
                      <option value="space-around">Space Around</option>
                    </select>

                    <label className="block mb-2 text-white">Align Items</label>
                    <select
                      name="alignItems"
                      value={componentStyle.alignItems || 'stretch'}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const { name, value } = e.target;
                        const updatedStyle = { ...componentStyle, [name]: value };
                        onUpdateStyle(editingComponentId as string, updatedStyle);
                      }}
                      className="w-full p-2 mb-2 text-white rounded bg-stone-700"
                    >
                      <option value="stretch">Stretch</option>
                      <option value="flex-start">Flex Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">Flex End</option>
                      <option value="baseline">Baseline</option>
                    </select>

                    <label className="block mb-2 text-white">Gap</label>
                    <input
                      type="range"
                      name="gap"
                      min="0"
                      max="50"
                      value={parseInt(componentStyle.gap as string) || 0}
                      onChange={handleRangeChange}
                      className="w-full"
                    />
                    <span className="text-white">{parseInt(componentStyle.gap as string) || 0}px</span>
                  </div>
                )}

                {/* Grid options */}
                {componentStyle.display === 'grid' && (
                  <div className="mt-2">
                    <label className="block mb-2 text-white">Grid Template Columns</label>
                    <input
                      type="text"
                      name="gridTemplateColumns"
                      value={componentStyle.gridTemplateColumns || ''}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 mb-2 border rounded"
                      placeholder="e.g., 1fr 1fr 1fr"
                    />

                    <label className="block mb-2 text-white">Grid Template Rows</label>
                    <input
                      type="text"
                      name="gridTemplateRows"
                      value={componentStyle.gridTemplateRows || ''}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 mb-2 border rounded"
                      placeholder="e.g., auto auto"
                    />

                    <label className="block mb-2 text-white">Gap</label>
                    <input
                      type="range"
                      name="gap"
                      min="0"
                      max="50"
                      value={parseInt(componentStyle.gap as string) || 0}
                      onChange={handleRangeChange}
                      className="w-full"
                    />
                    <span className="text-white">{parseInt(componentStyle.gap as string) || 0}px</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
