import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  const paths = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [
    { label: 'ホーム', path: '/' }
  ];

  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += `/${path}`;

    switch (path) {
      case 'projects':
        items.push({ label: '作品管理', path: currentPath });
        break;
      case 'staff':
        items.push({ label: 'スタッフ', path: currentPath });
        break;
      case 'schedule':
        items.push({ label: 'スケジュール', path: currentPath });
        break;
      case 'settings':
        items.push({ label: '設定', path: currentPath });
        break;
      case 'cut-sheet':
        items.push({ label: 'カット管理', path: currentPath });
        break;
      case 'cut-management':
        items.push({ label: 'カット詳細', path: currentPath });
        break;
      case 'cut-progress':
        items.push({ label: 'カット進行表', path: currentPath });
        break;
      case 'kouban-hyou':
        // kouban-hyou の場合は、先頭のセグメントとして扱う
        if (index === 0) {
          if (paths.length === 1) {
            items.push({ label: '香盤表', path: currentPath });
          } else {
            const nextSegment = paths[index + 1];
            if (nextSegment === 'new') {
              items.push({ label: '香盤表', path: '/kouban-hyou' });
              items.push({ label: '新規作成', path: '/kouban-hyou/new' });
            } else if (paths.includes('overview')) {
              // 一覧表示画面の場合は、編集リンクはIDの部分のみ（/kouban-hyou/1）にする
              items.push({ label: '香盤表', path: `/kouban-hyou` });
              items.push({ label: '編集', path: `/kouban-hyou/${nextSegment}` });
              items.push({ label: '一覧表示', path: `/kouban-hyou/${nextSegment}/overview` });
            } else {
              items.push({ label: '香盤表', path: `/kouban-hyou` });
              items.push({ label: '編集', path: `/kouban-hyou/${nextSegment}` });
            }
          }
        }
        break;
      case 'character-settings':
        items.push({ label: 'キャラクター設定', path: currentPath });
        break;
      default:
        break;
    }
  });

  return items;
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const items = getBreadcrumbItems(location.pathname);

  if (items.length === 1) return null;

  return (
    <nav className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const key = `${item.path}-${index}`;
          return (
            <React.Fragment key={key}>
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              <li>
                {index === items.length - 1 ? (
                  <span className="text-gray-600">{item.label}</span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
