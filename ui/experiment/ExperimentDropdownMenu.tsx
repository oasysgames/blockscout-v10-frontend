import { Box } from '@chakra-ui/react';
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
    <Box
      as="select"
      value={ selectedId }
      onChange={ handleSelection }
      w="100%"
      h="32px"
      px={ 3 }
      borderWidth="1px"
      borderRadius="md"
      bg="transparent"
      fontSize="sm"
      outline="none"
    >
      { items.map((item) => (
        <option key={ item.id } value={ item.id }>
          { item.title }
        </option>
      )) }
    </Box>
  );
}

export default ExperimentDropdownMenu;
