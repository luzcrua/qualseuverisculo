import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, categories(*)`)
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ['relatedPosts', post?.category_id],
    enabled: !!post?.category_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, categories(*)`)
        .eq('category_id', post.category_id)
        .neq('id', post.id)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-celestial-50 to-celestial-200">
      <Link to="/" className="fixed top-8 left-8 z-10">
        <Button variant="outline" className="rounded-full">
          ← Voltar
        </Button>
      </Link>

      <article className="max-w-3xl mx-auto px-8 py-20">
        <header className="text-center mb-12">
          <div className="text-celestial-600 mb-4">
            {post.categories?.name}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-celestial-600 to-celestial-800">
            {post.title}
          </h1>
          <div className="text-gray-600 mb-8">
            {new Date(post.created_at).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="rounded-2xl overflow-hidden mb-12">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>
      </article>

      {relatedPosts && relatedPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-8 mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Posts Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/post/${relatedPost.slug}`}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={relatedPost.image_url}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{relatedPost.title}</h3>
                  <p className="text-gray-600">{relatedPost.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="bg-white/10 backdrop-blur-sm py-8 mt-20">
        <div className="max-w-screen-xl mx-auto px-8 text-center text-gray-600">
          <p>© 2024 Blog do Futuro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;