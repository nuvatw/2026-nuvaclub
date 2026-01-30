import { NextResponse } from 'next/server';
// In real app, these services would be SearchService
import { getAllCourses, getAllShopProducts, getProjectsWithSeasonInfo } from '@/infra/mock/legacy';

export async function GET() {
    // Simple aggregation for Phase 1
    const courses = getAllCourses();
    const products = getAllShopProducts();
    const projects = getProjectsWithSeasonInfo();

    return NextResponse.json({
        courses: courses.map(c => ({ id: c.id, title: c.title, type: 'course', url: `/learn/${c.id}` })),
        products: products.map(p => ({ id: p.id, title: p.name, type: 'product', url: `/shop/${p.id}` })),
        projects: projects.map(p => ({ id: p.id, title: p.title, type: 'project', url: `/sprint/${p.sprintId}/project/${p.id}` }))
    });
}
