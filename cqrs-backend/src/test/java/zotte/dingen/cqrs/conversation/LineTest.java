package zotte.dingen.cqrs.conversation;

import org.junit.Test;


import static org.assertj.core.api.Assertions.assertThat;
import static zotte.dingen.cqrs.conversation.LineTestBuilder.aContextLine;
import static zotte.dingen.cqrs.conversation.LineTestBuilder.aSpeechLine;

public class LineTest {

    @Test
    public void aSpeechLine_WhenItHasLeast1Participant_IsValid() throws Exception {
        Line validLine = aSpeechLine().withParticipants(new Participant("Gianni", false)).build();
        assertThat(Line.isValid(validLine)).isTrue();
    }

    @Test
    public void aSpeechLine_WhenItHasNoParticipants_IsNotValid() throws Exception {
        Line validLine = aSpeechLine().withoutParticipants().build();
        assertThat(Line.isValid(validLine)).isFalse();
    }

    @Test
    public void aContextLine_WhenItHasNoParticipants_IsValid() throws Exception {
        Line validLine = aContextLine().withoutParticipants().build();
        assertThat(Line.isValid(validLine)).isTrue();
    }
}
