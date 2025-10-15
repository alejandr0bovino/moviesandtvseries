import Link from 'next/link';
import Image from 'next/image';
import { IconPhotoOff } from "@tabler/icons-react";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
  cast_id: number;
  credit_id: string;
}

interface GlobalCastProps {
  cast: CastMember[] | undefined;
}

export function GlobalCast({ cast }: GlobalCastProps) {
  if (!cast || cast.length === 0) return null;

  return (
    <>
      <div className='mb-4'>
        <strong>Cast</strong>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {cast.slice(0, 10).map((member) => (
            <div key={member.cast_id || member.credit_id} className='text-center'>
              <Link href={`/people/${member.id}`}>
                <div className='relative w-20 h-20 mx-auto mb-2'>
                  {member.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185/${member.profile_path}`}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover border-1 border-gray-400 p-1 saturate-65"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallbackDiv = target.nextElementSibling as HTMLElement;
                        if (fallbackDiv) {
                          fallbackDiv.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`${member.profile_path ? 'hidden' : 'flex'} items-center justify-center bg-gray-200 rounded-full text-gray-500 text-xs font-medium text-center`}
                    style={{ width: "70px", height: "70px" }}
                  >
                    <IconPhotoOff className="w-6 h-6" />
                  </div>
                </div>
                <p className='text-sm font-medium text-center line-clamp-2'>{member.name}</p>
                <p className='text-xs text-gray-500 text-center line-clamp-2'>{member.character}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <hr className="-mt-2 -mb-4 hr-text" />
    </>
  );
}

