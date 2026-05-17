export type User = {
  uid: string;
  role: 'photographer';
  email: string;
};

export type Wedding = {
  id: string;
  title: string;
  createdBy: string;
  shareCode: string;
  createdAt: any;
};

export type Photo = {
  id: string;
  weddingId: string;
  uploadedBy: 'guest' | 'photographer';
  imageUrl: string;
  storagePath?: string;
  localAssetId?: string | null;
  createdAt: any;
};
