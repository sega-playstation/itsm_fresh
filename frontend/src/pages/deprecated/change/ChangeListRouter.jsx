import ChangeDataGrid from '@/components/deprecated/UI/DataGrids/ChangeDataGrid';

export default function ChangeListRouter() {
  document.title = 'All Change Requests - PiXELL-River';

  return (
    <>
      <ChangeDataGrid />
    </>
  );
}
