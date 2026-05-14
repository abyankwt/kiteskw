import { useState } from 'react';
import { Globe, Eye, EyeOff, ChevronDown, ChevronRight, Save, RotateCcw, CheckCircle, Code2, ExternalLink } from 'lucide-react';
import {
  useAdminCmsPages,
  useCmsPage,
  useUpdateBlock,
  useToggleSection,
  usePublishPage,
  CmsBlock,
  CmsSection,
} from '@/hooks/useCmsPage';
import { usePermission } from '@/hooks/usePermission';
import toast from 'react-hot-toast';

// ─── Text block editor ────────────────────────────────────────────────────────
function TextBlockEditor({
  blockId,
  currentValue,
  locale,
}: {
  blockId: string;
  currentValue: string | null;
  locale: 'en' | 'ar';
}) {
  const [value, setValue] = useState(currentValue ?? '');
  const [saved, setSaved] = useState(false);
  const updateBlock = useUpdateBlock();
  const canEdit = usePermission('cms:edit');
  const multiline = (currentValue ?? '').length > 80;

  const handleSave = async () => {
    if (!blockId) { toast.error('Block ID missing — re-run the CMS seed migration'); return; }
    await updateBlock.mutateAsync({ blockId, value_text: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex gap-2 items-start">
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!canEdit}
          rows={3}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y disabled:bg-gray-50 font-mono"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!canEdit}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />
      )}
      {canEdit && (
        <button
          onClick={handleSave}
          disabled={updateBlock.isPending || !blockId}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
        >
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? 'Saved' : 'Save'}
        </button>
      )}
    </div>
  );
}

// ─── JSON block editor ────────────────────────────────────────────────────────
function JsonBlockEditor({
  blockId,
  currentValue,
}: {
  blockId: string;
  currentValue: object | null;
}) {
  const [value, setValue] = useState(JSON.stringify(currentValue, null, 2));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const updateBlock = useUpdateBlock();
  const canEdit = usePermission('cms:edit');

  const handleSave = async () => {
    if (!blockId) { toast.error('Block ID missing — re-run the CMS seed migration'); return; }
    try {
      const parsed = JSON.parse(value);
      setError('');
      await updateBlock.mutateAsync({ blockId, value_json: parsed });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Invalid JSON — please fix before saving');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Code2 size={12} className="text-purple-500" />
        <span className="text-xs text-purple-600 font-medium">JSON Array / Object</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => { setValue(e.target.value); setError(''); }}
        disabled={!canEdit}
        rows={8}
        className="w-full px-3 py-2 text-xs border border-purple-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 resize-y disabled:bg-gray-50 font-mono bg-purple-50/30"
        spellCheck={false}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {canEdit && (
        <button
          onClick={handleSave}
          disabled={updateBlock.isPending || !blockId}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? 'Saved' : 'Save JSON'}
        </button>
      )}
    </div>
  );
}

// ─── Color block editor ───────────────────────────────────────────────────────
function ColorBlockEditor({ blockId, currentValue }: { blockId: string; currentValue: string | null }) {
  const [value, setValue] = useState(currentValue ?? '#000000');
  const [saved, setSaved] = useState(false);
  const updateBlock = useUpdateBlock();
  const canEdit = usePermission('cms:edit');

  const handleSave = async () => {
    await updateBlock.mutateAsync({ blockId, value_text: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="color"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={!canEdit}
        className="w-10 h-9 rounded border border-gray-200 cursor-pointer p-0.5"
      />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={!canEdit}
        className="w-28 px-3 py-2 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {canEdit && (
        <button
          onClick={handleSave}
          disabled={updateBlock.isPending}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? 'Saved' : 'Save'}
        </button>
      )}
    </div>
  );
}

// ─── Image block editor ───────────────────────────────────────────────────────
function ImageBlockEditor({ blockId, currentValue }: { blockId: string; currentValue: string | null }) {
  const [value, setValue] = useState(currentValue ?? '');
  const [saved, setSaved] = useState(false);
  const updateBlock = useUpdateBlock();
  const canEdit = usePermission('cms:edit');

  const handleSave = async () => {
    await updateBlock.mutateAsync({ blockId, value_text: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-2">
      {value && (
        <img src={value} alt="" className="h-24 rounded-lg border border-gray-200 object-cover" />
      )}
      <div className="flex gap-2 items-start">
        <input
          type="url"
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={!canEdit}
          placeholder="https://..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {canEdit && (
          <button
            onClick={handleSave}
            disabled={updateBlock.isPending}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
          >
            {saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saved ? 'Saved' : 'Save'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Select block editor ──────────────────────────────────────────────────────
function SelectBlockEditor({ blockId, currentValue, options }: { blockId: string; currentValue: string | null; options: string[] }) {
  const [value, setValue] = useState(currentValue ?? (options[0] ?? ''));
  const [saved, setSaved] = useState(false);
  const updateBlock = useUpdateBlock();
  const canEdit = usePermission('cms:edit');

  const handleSave = async () => {
    await updateBlock.mutateAsync({ blockId, value_text: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex gap-2 items-center">
      <select
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={!canEdit}
        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {canEdit && (
        <button
          onClick={handleSave}
          disabled={updateBlock.isPending}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
        >
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? 'Saved' : 'Save'}
        </button>
      )}
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ sectionKey, section }: { sectionKey: string; section: CmsSection }) {
  const [expanded, setExpanded] = useState(false);
  const toggleSection = useToggleSection();
  const canEdit = usePermission('cms:edit');

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          {section.display_name}
          <span className="text-xs text-gray-400 font-normal">({sectionKey})</span>
        </button>
        {canEdit && (
          <button
            onClick={() =>
              toggleSection.mutate({ sectionId: section.id, isVisible: !section.is_visible })
            }
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
              section.is_visible
                ? 'text-green-700 bg-green-50 hover:bg-green-100'
                : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {section.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
            {section.is_visible ? 'Visible' : 'Hidden'}
          </button>
        )}
      </div>

      {expanded && (
        <div className="p-4 space-y-5">
          {Object.entries(section.blocks).map(([fieldKey, block]) => {
            const blockType = block._type ?? 'text';
            const isJson = blockType.includes('array') || blockType.includes('json') || (block.en !== null && typeof block.en === 'object');
            const isColor = blockType === 'color';
            const isImage = blockType === 'image';
            const isSelect = blockType === 'select';
            const selectOptions: string[] = isSelect && Array.isArray((block.en as any)?.options)
              ? (block.en as any).options
              : [];

            return (
              <div key={fieldKey} className="space-y-2">
                <p className="text-xs font-mono font-semibold text-gray-600 bg-gray-100 inline-px-2 py-0.5 rounded px-2">
                  {fieldKey}
                  {isColor && <span className="ml-1 text-gray-400">(color)</span>}
                  {isImage && <span className="ml-1 text-gray-400">(image)</span>}
                  {isSelect && <span className="ml-1 text-gray-400">(select)</span>}
                </p>

                {isColor ? (
                  <ColorBlockEditor
                    blockId={block._ids?.en ?? ''}
                    currentValue={block.en as string | null}
                  />
                ) : isImage ? (
                  <ImageBlockEditor
                    blockId={block._ids?.en ?? ''}
                    currentValue={block.en as string | null}
                  />
                ) : isSelect ? (
                  <SelectBlockEditor
                    blockId={block._ids?.en ?? ''}
                    currentValue={block.en as string | null}
                    options={selectOptions}
                  />
                ) : isJson ? (
                  <JsonBlockEditor
                    blockId={block._ids?.en ?? ''}
                    currentValue={(block.en as object | null) ?? null}
                  />
                ) : (
                  (['en', 'ar'] as const).map((locale) => {
                    const blockId = block._ids?.[locale];
                    const val = block[locale] as string | null;
                    if (!blockId && !val) return null;
                    return (
                      <div key={locale} className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {locale === 'en' ? '🇬🇧 English' : '🇸🇦 Arabic'}
                        </span>
                        <TextBlockEditor
                          blockId={blockId ?? ''}
                          currentValue={val}
                          locale={locale}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Page editor ──────────────────────────────────────────────────────────────
function PageEditor({ slug }: { slug: string }) {
  const { data: page, isLoading } = useCmsPage(slug);
  const publishPage = usePublishPage();
  const canPublish = usePermission('cms:publish');

  if (isLoading) {
    return <div className="text-sm text-gray-400 py-8 text-center">Loading page...</div>;
  }
  if (!page) {
    return <div className="text-sm text-red-500 py-8 text-center">Page not found</div>;
  }

  const hasSections = Object.keys(page.sections).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{page.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">/{slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(`/${slug}`, '_blank')}
            className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={13} />
            Preview
          </button>
          {canPublish && (
            <button
              onClick={() => publishPage.mutate({ slug, publish: !page.is_published })}
              disabled={publishPage.isPending}
              className={`text-sm px-4 py-2 rounded-lg font-medium ${
                page.is_published
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {page.is_published ? 'Unpublish' : 'Publish'}
            </button>
          )}
        </div>
      </div>

      {!hasSections ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-400">No content blocks seeded for this page yet.</p>
          <p className="text-xs text-gray-300 mt-1">Run migration 015 in Supabase to populate all pages.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(page.sections).map(([key, section]) => (
            <SectionCard key={key} sectionKey={key} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminCMS() {
  const { data: pages, isLoading } = useAdminCmsPages();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">CMS Editor</h1>
        <p className="text-sm text-gray-500 mt-1">Edit website content for all pages</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Page list */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pages</p>
            </div>
            {isLoading ? (
              <div className="p-4 text-sm text-gray-400">Loading...</div>
            ) : (
              <ul>
                {(pages ?? []).map((page: any) => (
                  <li key={page.slug}>
                    <button
                      onClick={() => setSelectedSlug(page.slug)}
                      className={`w-full flex items-center gap-2 px-4 py-3 text-sm text-left hover:bg-gray-50 border-b border-gray-50 ${
                        selectedSlug === page.slug
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      <Globe size={14} />
                      {page.title}
                      <span
                        className={`ml-auto w-2 h-2 rounded-full ${
                          page.is_published ? 'bg-green-400' : 'bg-gray-300'
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Editor panel */}
        <div className="col-span-3">
          {selectedSlug ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <PageEditor slug={selectedSlug} />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Globe size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Select a page to edit its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
