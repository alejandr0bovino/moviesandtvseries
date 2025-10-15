interface ProductionCompany {
  id: number;
  name: string;
}

interface GlobalProductionProps {
  production_companies: ProductionCompany[] | null | undefined;
}

export function GlobalProduction({ production_companies }: GlobalProductionProps) {
  return (
    <div className='flex items-center gap-2 leading-9'>
      <strong>Production companies</strong>
      <ul className="flex flex-wrap">
        {production_companies && production_companies.length > 0 ? (
          production_companies.map((company, index: number, array: any[]) => (
            <li key={company.id} className='list-none mr-2 flex items-center'>
              <span className='mr-2'>{company.name}</span>
              {index < array.length - 1 && <span className='text-2xl text-gray-500'>•</span>}
            </li>
          ))
        ) : 'Not available'}
      </ul>
    </div>
  );
}

