import React, { useCallback } from 'react';

type Props<T extends string> = {
  items: ReadonlyArray<{ id: T; title: string }>;
  selectedId: T;
  onSelect: (id: T) => void;
};

export function ExperimentDropdownMenu<T extends string>({ items, selectedId, onSelect }: Props<T>) {
  const handleSelection = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onSelect(event.target.value as T);
    },
    [ onSelect ],
  );

  return (
    <select
      value={ selectedId }
      onChange={ handleSelection }
      style={{
        width: '100%',
        height: '32px',
        padding: '0 12px',
        borderWidth: '1px',
        borderRadius: '0.375rem',
        background: 'transparent',
        fontSize: '0.875rem',
        outline: 'none',
      }}
    >
      { items.map((item) => (
        <option key={ item.id } value={ item.id }>
          { item.title }
        </option>
      )) }
    </select>
  );
}

export default ExperimentDropdownMenu;
