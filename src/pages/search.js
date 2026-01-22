import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import SEO from '../components/SEO';

const SearchContainer = styled.div`
  margin: 0 auto;
  padding: var(--spacing-xl) 0;
`;

const SearchHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const TerminalCommand = styled.h2`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-p);
  margin-bottom: var(--spacing-md);
  
  span {
    color: var(--yellow);
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
`;

const SearchIcon = styled.span`
  position: absolute;
  left: var(--spacing-lg);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--font-size-h3);
  color: var(--yellow);
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-lg) calc(var(--spacing-lg) * 3);
  background-color: var(--blue);
  border: 2px solid var(--yellow);
  border-radius: var(--radius-md);
  color: var(--white);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-p);
  outline: none;
  transition: all var(--transition-normal);
  
  &:focus {
    box-shadow: 0 0 20px rgba(255, 221, 26, 0.3);
    border-color: var(--yellow);
  }
  
  &::placeholder {
    color: var(--grey);
    opacity: 0.7;
  }
  
  @media screen and (max-width: 760px) {
    font-size: var(--font-size-body);
    padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) calc(var(--spacing-md) * 3);
  }
`;

const ResultsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ResultsCount = styled.p`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-small);
  margin-bottom: var(--spacing-lg);
  text-align: center;
  
  strong {
    color: var(--yellow);
  }
`;

const ResultCard = styled.article`
  background: var(--blue);
  border-left: 3px solid var(--yellow);
  border-radius: var(--radius-sm);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateX(10px);
    box-shadow: 0 0 20px rgba(255, 221, 26, 0.1);
  }
`;

const ResultTitle = styled.h3`
  margin: 0 0 var(--spacing-sm);
  
  a {
    color: var(--yellow);
    text-decoration: none;
    font-size: var(--font-size-h3);
    
    &:hover {
      text-decoration: underline;
      border-bottom: none;
    }
  }
  
  @media screen and (max-width: 760px) {
    a {
      font-size: var(--font-size-body);
    }
  }
`;

const ResultMeta = styled.div`
  display: flex;
  gap: var(--spacing-md);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-meta);
  color: var(--grey);
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap;
`;

const ResultExcerpt = styled.p`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-small);
  line-height: 1.6;
  margin: 0;
  
  mark {
    background-color: var(--yellow);
    color: var(--dark);
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: bold;
  }
  
  @media screen and (max-width: 760px) {
    font-size: var(--font-size-meta);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-p);
  padding: var(--spacing-2xl);
  
  &::after {
    content: '...';
    animation: dots 1.5s steps(4, end) infinite;
  }
  
  @keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  background: var(--blue);
  border: 2px dashed var(--yellow);
  border-radius: var(--radius-md);
  
  p {
    font-family: 'Roboto Mono', monospace;
    color: var(--grey);
    font-size: var(--font-size-p);
    margin-bottom: var(--spacing-md);
  }
  
  strong {
    color: var(--yellow);
  }
`;

const Suggestions = styled.div`
  margin-top: var(--spacing-lg);
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-small);
  
  ul {
    list-style: none;
    padding: 0;
    margin-top: var(--spacing-sm);
    
    li {
      padding-left: var(--spacing-md);
      margin-bottom: var(--spacing-xs);
      
      &::before {
        content: '> ';
        color: var(--yellow);
        margin-right: var(--spacing-xs);
      }
    }
  }
`;

const KeyboardHint = styled.div`
  text-align: center;
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-small);
  margin-top: var(--spacing-xl);
  opacity: 0.7;
  
  kbd {
    background: var(--blue);
    border: 2px solid var(--yellow);
    border-radius: 3px;
    padding: 2px 8px;
    font-family: 'Roboto Mono', monospace;
    color: var(--yellow);
    margin: 0 4px;
  }
`;

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagefind, setPagefind] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Load Pagefind
  useEffect(() => {
    async function loadPagefind() {
      try {
        if (typeof window !== 'undefined') {
          console.log('Loading Pagefind...');
          // @ts-ignore
          const pagefindModule = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js');
          console.log('Pagefind loaded successfully:', pagefindModule);
          await pagefindModule.options({
            excerptLength: 30,
          });
          setPagefind(pagefindModule);
          setError(null);
          console.log('Pagefind initialized');
        }
      } catch (err) {
        console.error('Error loading Pagefind:', err);
        setError('Search index not found. Run "npm run build" to generate the search index.');
      }
    }
    loadPagefind();
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Get query from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlQuery = params.get('q');
      if (urlQuery) {
        setQuery(urlQuery);
      }
    }
  }, []);

  // Perform search
  useEffect(() => {
    async function search() {
      if (!pagefind || !query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await pagefind.search(query);
        const data = await Promise.all(
          searchResults.results.map((result) => result.data())
        );
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query, pagefind]);

  // Update URL with query
  useEffect(() => {
    if (typeof window !== 'undefined' && query) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', query);
      window.history.replaceState({}, '', url);
    }
  }, [query]);

  return (
    <div className="item1">
      <SearchContainer>
        <SearchHeader>
          <h1>Search</h1>
          <TerminalCommand>
            <span>$</span> grep -r "{query || '...'}" ./blog/posts
          </TerminalCommand>
        </SearchHeader>

        <SearchInputContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            ref={inputRef}
            type="text"
            placeholder="Search blog posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search blog posts"
          />
        </SearchInputContainer>

        <ResultsContainer>
          {error && (
            <NoResults>
              <p>⚠️ <strong>{error}</strong></p>
              <Suggestions>
                <ul>
                  <li>Run <code style={{ color: 'var(--yellow)', background: 'var(--blue)', padding: '2px 6px', borderRadius: '3px' }}>npm run build</code> to generate search index</li>
                  <li>Then run <code style={{ color: 'var(--yellow)', background: 'var(--blue)', padding: '2px 6px', borderRadius: '3px' }}>npm run serve</code> to test</li>
                  <li>Search only works in production build, not development</li>
                </ul>
              </Suggestions>
            </NoResults>
          )}
          
          {!error && loading && <LoadingMessage>Searching</LoadingMessage>}

          {!error && !loading && query && results.length > 0 && (
            <>
              <ResultsCount>
                Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"
              </ResultsCount>

              {results.map((result, index) => (
                <ResultCard key={index}>
                  <ResultTitle>
                    <Link to={result.url}>{result.meta?.title || 'Untitled'}</Link>
                  </ResultTitle>
                  
                  {result.meta?.date && (
                    <ResultMeta>
                      <span>📅 {result.meta.date}</span>
                      {result.meta?.tags && (
                        <span>🏷️ {result.meta.tags}</span>
                      )}
                    </ResultMeta>
                  )}
                  
                  <ResultExcerpt
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                </ResultCard>
              ))}
            </>
          )}

          {!error && !loading && query && results.length === 0 && (
            <NoResults>
              <p>
                No results found for "<strong>{query}</strong>"
              </p>
              
              <Suggestions>
                Try:
                <ul>
                  <li>Using different keywords</li>
                  <li>Checking your spelling</li>
                  <li>Using more general terms</li>
                  <li>Browsing <Link to="/topics">topics</Link> or <Link to="/posts">all posts</Link></li>
                </ul>
              </Suggestions>
            </NoResults>
          )}

          {!error && !query && (
            <NoResults>
              <p>Start typing to search all blog posts</p>
              <Suggestions>
                Popular topics: Linux, Gatsby, SharePoint, Windows, Arch Linux
              </Suggestions>
            </NoResults>
          )}
        </ResultsContainer>

        <KeyboardHint>
          Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to open command palette
        </KeyboardHint>
      </SearchContainer>
    </div>
  );
}

export const Head = () => <SEO title="Search" />;
