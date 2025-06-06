import { ClipLoader } from "react-spinners";

type Props = { loading: boolean };

export function Spinner({ loading }: Props) {
  return <ClipLoader color='#3b82f6' loading={loading} size={35} />;
}
