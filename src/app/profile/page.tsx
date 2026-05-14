'use client';

import { useCurrentUser } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await api.get('/api/analytics/favorites/');
      return response.data;
    },
  });

  const { data: watchHistory } = useQuery({
    queryKey: ['watch-history'],
    queryFn: async () => {
      const response = await api.get('/api/analytics/history/');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="md:col-span-3 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge>{user.is_active ? 'Active' : 'Inactive'}</Badge>
                  <Badge variant="outline">
                    Member since{' '}
                    {new Date(user.date_joined).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
              <Button asChild>
                <Link href="/settings">Edit Profile</Link>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Favorites */}
        {favorites?.results && favorites.results.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Favorites</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favorites.results.map((favorite: any, index: number) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/${favorite.content_type}s/${favorite.content.slug}`}>
                    <div className="group relative rounded-lg overflow-hidden cursor-pointer">
                      <Image
                        src={favorite.content.poster_path}
                        alt={favorite.content.title}
                        width={200}
                        height={300}
                        className="w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Watch History */}
        {watchHistory?.results && watchHistory.results.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">Watch History</h2>
            <div className="space-y-4">
              {watchHistory.results.slice(0, 10).map((item: any) => (
                <Card key={item.id} className="p-4">
                  <Link href={`/movies/${item.content.slug}`}>
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                      <div className="w-24 h-32 relative flex-shrink-0 rounded">
                        <Image
                          src={item.content.poster_path}
                          alt={item.content.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {item.content.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Watched on{' '}
                          {new Date(item.watched_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}