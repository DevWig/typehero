import { type Session } from '@repo/auth/server';
import { buildMetaForChallenge, buildMetaForEventPage } from '~/app/metadata';
import { getRelativeTimeStrict } from '~/utils/relativeTime';
import { Comments } from '../_components/comments';
import { Description } from '../_components/description';
import { AOT_CHALLENGES } from './aot-slugs';
import { getChallengeRouteData } from './getChallengeRouteData';
import { auth } from '~/server/auth';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params: { slug } }: Props) {
  if (AOT_CHALLENGES.includes(slug)) {
    return buildMetaForEventPage({
      title: 'Advent of Typescript 2023 | TypeHero',
      description: 'Advent of Typescript 2023',
    });
  }

  const { challenge } = await getChallengeRouteData(slug, null);
  const description = `Unlock your TypeScript potential by solving the ${challenge.name} challenge on TypeHero.`;

  return buildMetaForChallenge({
    title: `${challenge.name} | TypeHero`,
    description,
    username: challenge.user.name,
    difficulty: challenge.difficulty,
    date: getRelativeTimeStrict(challenge.createdAt),
  });
}

export default async function Challenges({ params: { slug } }: Props) {
  const session = await auth();

  const { challenge } = await getChallengeRouteData(slug, session);

  return (
    <div className="relative h-full ">
      <Description challenge={challenge} />
      <Comments root={challenge} type="CHALLENGE" />
    </div>
  );
}

export function isAuthor(session: Session | null, userId?: string | null) {
  return userId && session?.user?.id && userId === session?.user?.id;
}
