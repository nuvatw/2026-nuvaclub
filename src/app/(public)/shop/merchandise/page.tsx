'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Button, Card, CardContent } from '@/components/atoms';
import { Gate } from '@/features/auth/components/Gate';
import { MERCHANDISE } from '@/mocks';

export default function MerchandisePage() {
    return (
        <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Merchandise</h1>
                    <p className="text-neutral-400">
                        Exclusive nuvaClub merchandise, show your community identity
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MERCHANDISE.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card hover className="h-full overflow-hidden flex flex-col">
                                <div className="relative aspect-square">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="flex flex-col flex-grow">
                                    <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                                    <p className="text-sm text-neutral-400 mb-3 flex-grow">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-lg font-bold text-white">
                                            ${item.price}
                                        </span>
                                        <Gate
                                            permission="shop:purchase"
                                            fallback={
                                                <Button size="sm" variant="secondary" disabled>
                                                    Log in to purchase
                                                </Button>
                                            }
                                        >
                                            <Button size="sm" variant="secondary">
                                                Add to Cart
                                            </Button>
                                        </Gate>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
