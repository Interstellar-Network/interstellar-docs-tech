import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function Home() {
  const history = useHistory();

  useEffect(() => {
    history.push('/docs/intro'); // Redirect to /docs
  }, []);

  return null;
}

{/**
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { Card, CardContent } from "@site/src/components/ui/card";
import { Button } from "@site/src/components/ui/button";




export default function DocumentationHub() {
  return (
    <Layout title="Documentation Hub" description="Start exploring Interstellar's core features and technical architecture.">
      <main className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-interstellar dark:text-interstellar-dark mb-4">
            Documentation Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Explore Interstellar’s innovative authentication infrastructure, deep technology, and security architecture.
          </p>
          <Button asChild>
            <Link to="/docs/intro">Get Started</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/docs/category/about-interstellar" className="block h-full">
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all h-full">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-interstellar dark:text-interstellar-dark mb-2">
                  What is Interstellar?
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Learn about our vision, motivation, and mission to redefine Web3 security and onboarding.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/docs/category/smart-account-features" className="block h-full">
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all h-full">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-interstellar dark:text-interstellar-dark mb-2">
                  Smart Account Features
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Discover Interstellar’s core account capabilities: recovery, validation, authentication.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/docs/category/interstellar-deep-technology" className="block h-full">
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all h-full">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-interstellar dark:text-interstellar-dark mb-2">
                  Deep Technology
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Explore advanced technologies: Garbled Circuits, Visual Crypto, SE Attestation, and more.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/docs/category/interstellar-security" className="block h-full">
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all h-full">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-interstellar dark:text-interstellar-dark mb-2">
                  Security Architecture
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Understand our threat models and architecture decisions designed for AI-era protection.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </Layout>
  );
} **/}
