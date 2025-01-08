import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CategoryPage = () => {
  const { slug } = useParams();

  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ['categoryPosts', category?.id],
    enabled: !!category?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (!category) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-celestial-100 to-celestial-300">
      <Link to="/" className="fixed top-8 left-8">
        <Button variant="outline" className="rounded-full">
          ← Voltar para Home
        </Button>
      </Link>

      <main className="max-w-screen-xl mx-auto px-8 py-20">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-celestial-500 to-celestial-700">
            {category.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts?.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.slug}`}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image_url || 'https://via.placeholder.com/800x400'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h3>
                <p className="text-gray-600">{post.excerpt}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <footer className="bg-white/10 backdrop-blur-sm py-8 mt-20">
        <div className="max-w-screen-xl mx-auto px-8 text-center text-gray-600">
          <p>© 2024 Blog do Futuro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default CategoryPage;