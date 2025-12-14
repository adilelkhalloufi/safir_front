 
interface SponsorProps {
  icon: JSX.Element;
  name: string;
}

export function Sponsors() {
 
  const sponsors: SponsorProps[] = [
    {
      icon: <img src="./s1.png" className="size-28" />,
      name: "Sponsor 1",
    }, {
      icon: <img src="./s2.png" className="size-28" />,
      name: "Sponsor 1",
    }, {
      icon: <img src="./s3.png" className="size-28" />,
      name: "Sponsor 1",
    }, {
      icon: <img src="./s4.png" className="size-28" />,
      name: "Sponsor 1",
    },

  ];
  return (
    <section className="py-16 container">
      <div className="text-center">
        <h2 className="text-sm font-semibold text-muted-foreground mb-8">
          Trusted by leading companies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-70">
          {sponsors.map(({ icon }: SponsorProps,index) => (
            <div
              key={index}
              className="flex items-center gap-1 text-muted-foreground/60"
            >
              <span>{icon}</span>
              {/* <h3 className="text-xl  font-bold">{name}</h3> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}