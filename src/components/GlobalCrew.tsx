import { Link as Linkui } from "@heroui/react";

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  credit_id: string;
}

interface GlobalCrewProps {
  crew: CrewMember[] | undefined;
  department: string;
}

export function GlobalCrew({ crew, department }: GlobalCrewProps) {
  if (!crew || crew.filter((c) => c.department === department).length === 0) {
    return (
      <div>
        <strong>{department}</strong> information not available.
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2 leading-9 -mb-2'>
      <strong>{department}</strong>
      <ul className="flex flex-wrap">
        {crew.filter((c) => c.department === department).slice(0, 3).map((member, index: number, array: any[]) => (
          <li key={member.credit_id} className='list-none mr-2 flex items-center'>
            <Linkui className='mr-1' underline="always" href={`/people/${member.id}`}>{member.name}</Linkui>
            <span className='mr-2 text-gray-500'>({member.job})</span>
            {index < array.length - 1 && <span className='text-2xl text-gray-500'>•</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

