'use client';

import { useEffect, useState } from 'react';
import SaveButton from '@/components/ui/SaveButton';
import { useFavoriteStore } from '@/stores/useFavoriteStore';

interface FavoriteButtonProps {
  itemId: number;
  size?: number | 'responsive';
  onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({ itemId, size = 48 }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const [isSaved, setIsSaved] = useState(() => isFavorite(itemId));

  useEffect(() => {
    setIsSaved(isFavorite(itemId));
  }, [itemId]);

  const handleToggle = () => {
    toggleFavorite(itemId);
    setIsSaved(isFavorite(itemId));
  };

  return <SaveButton isSaved={isSaved} ariaLabel="찜하기" onToggle={handleToggle} size={size} />;
}
