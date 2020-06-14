using System.Linq;
using AutoMapper;
using Domain;
namespace Application.Comments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
             CreateMap<Comment, CommentDto>()
                .ForMember(x => x.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(x => x.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(x => x.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x=>x.IsMain).Url));
        }

       
    }
}